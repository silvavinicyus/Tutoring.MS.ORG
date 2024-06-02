import { NotificationErrors } from '@business/module/errors/notificationErrors'
import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { UserErrors } from '@business/module/errors/userErrors'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { ITutoringRepositoryToken } from '@business/repositories/tutoring/iTutoringRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { INotificationServiceToken } from '@business/services/notification/iNotificationService'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateOrUpdateTutoringNotificationUseCase } from '@business/useCases/notification/createOrUpdateTutoringNotification'
import { CreateTutoringUseCase } from '@business/useCases/tutoring/createTutoring'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { CreateTutoringOperator } from '@controller/operations/tutoring/create'
import { InputCreateTutoring } from '@controller/serializers/tutoring/create'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeTutoringEntity } from '@tests/mock/entities/fakeTutoringEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeTutoringRepository } from '@tests/mock/repositories/fakeTutoringRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeNotificationService } from '@tests/mock/services/fakeNotificationService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Create Tutoring Operator', () => {
  beforeAll(() => {
    container.bind(CreateTutoringUseCase).toSelf().inSingletonScope()
    container.bind(FindByUserUseCase).toSelf().inSingletonScope()
    container
      .bind(CreateOrUpdateTutoringNotificationUseCase)
      .toSelf()
      .inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container
      .bind(ITutoringRepositoryToken)
      .to(FakeTutoringRepository)
      .inSingletonScope()
    container
      .bind(INotificationServiceToken)
      .to(FakeNotificationService)
      .inSingletonScope()
    container.bind(ITransactionRepositoryToken).to(FakeTransactionRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputCreateTutoring({
    date: new Date(),
    student_uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
    tutor_uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
    subject: 'software engineering',
  })

  test('Should fail to create a tutoring if tutor does not exists', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const sut = container.get(CreateTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.notFound())
  })

  test('Should fail to create a tutoring if student does not exists', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const sut = container.get(CreateTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.notFound())
  })

  test('Should fail to create a tutoring if tutoring creation failed', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const createTutoring = container.get(CreateTutoringUseCase)
    jest
      .spyOn(createTutoring, 'exec')
      .mockImplementationOnce(async () => left(TutoringErrors.creationError()))

    const sut = container.get(CreateTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TutoringErrors.creationError())
  })

  test('Should fail to create a tutoring if create notification failed to be sent', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const createTutoring = container.get(CreateTutoringUseCase)
    jest
      .spyOn(createTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const sendCreationNotification = container.get(
      CreateOrUpdateTutoringNotificationUseCase
    )
    jest
      .spyOn(sendCreationNotification, 'exec')
      .mockImplementationOnce(async () =>
        left(NotificationErrors.createOrUpdateTutoringFailed())
      )

    const sut = container.get(CreateTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(
      NotificationErrors.createOrUpdateTutoringFailed()
    )
  })

  test('Should have success to create a tutoring', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const createTutoring = container.get(CreateTutoringUseCase)
    jest
      .spyOn(createTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const sendCreationNotification = container.get(
      CreateOrUpdateTutoringNotificationUseCase
    )
    jest
      .spyOn(sendCreationNotification, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(CreateTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
