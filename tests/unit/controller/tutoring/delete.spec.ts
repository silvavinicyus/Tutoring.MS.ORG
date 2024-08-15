import { NotificationErrors } from '@business/module/errors/notificationErrors'
import { TransactionErrors } from '@business/module/errors/transactionErrors'
import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { ITutoringRepositoryToken } from '@business/repositories/tutoring/iTutoringRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { INotificationServiceToken } from '@business/services/notification/iNotificationService'
import { CreateOrUpdateTutoringNotificationUseCase } from '@business/useCases/notification/createOrUpdateTutoringNotification'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { DeleteTutoringUseCase } from '@business/useCases/tutoring/deleteTutoring'
import { FindByTutoringUseCase } from '@business/useCases/tutoring/findByTutoring'
import { DeleteTutoringOperator } from '@controller/operations/tutoring/delete'
import { InputDeleteTutoring } from '@controller/serializers/tutoring/delete'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeTutoringEntity } from '@tests/mock/entities/fakeTutoringEntity'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeTutoringRepository } from '@tests/mock/repositories/fakeTutoringRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeNotificationService } from '@tests/mock/services/fakeNotificationService'

describe('Delete Tutoring Operator', () => {
  beforeAll(() => {
    container
      .bind(CreateOrUpdateTutoringNotificationUseCase)
      .toSelf()
      .inSingletonScope()
    container.bind(CreateTransactionUseCase).toSelf().inSingletonScope()
    container.bind(DeleteTutoringUseCase).toSelf().inSingletonScope()
    container.bind(FindByTutoringUseCase).toSelf().inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(ITutoringRepositoryToken)
      .to(FakeTutoringRepository)
      .inSingletonScope()
    container.bind(INotificationServiceToken).to(FakeNotificationService)
    container.bind(ITransactionRepositoryToken).to(FakeTransactionRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputDeleteTutoring({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to delete a tutoring if tutoring does not exists', async () => {
    const findTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findTutoring, 'exec')
      .mockImplementationOnce(async () => left(TutoringErrors.notFound()))

    const sut = container.get(DeleteTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TutoringErrors.notFound())
  })

  test('Should fail to delete a tutoring if transcation failed to start', async () => {
    const findTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const createTranscation = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTranscation, 'exec')
      .mockImplementationOnce(async () =>
        left(TransactionErrors.creationError())
      )

    const sut = container.get(DeleteTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TransactionErrors.creationError())
  })

  test('Should fail to delete a tutoring if tutoring deletion failed', async () => {
    const findTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const deleteTutoring = container.get(DeleteTutoringUseCase)
    jest
      .spyOn(deleteTutoring, 'exec')
      .mockImplementationOnce(async () => left(TutoringErrors.deleteFailed()))

    const sut = container.get(DeleteTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TutoringErrors.deleteFailed())
  })

  test('Should fail to delete a tutoring if tutoring deletion notification failed', async () => {
    const findTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const deleteTutoring = container.get(DeleteTutoringUseCase)
    jest
      .spyOn(deleteTutoring, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const deleteTutoringNotification = container.get(
      CreateOrUpdateTutoringNotificationUseCase
    )
    jest
      .spyOn(deleteTutoringNotification, 'exec')
      .mockImplementationOnce(async () =>
        left(NotificationErrors.createOrUpdateTutoringFailed())
      )

    const sut = container.get(DeleteTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(
      NotificationErrors.createOrUpdateTutoringFailed()
    )
  })

  test('Should have success to delete a tutoring', async () => {
    const findTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const deleteTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(deleteTutoring, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(DeleteTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
