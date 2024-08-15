import { NotificationErrors } from '@business/module/errors/notificationErrors'
import { TransactionErrors } from '@business/module/errors/transactionErrors'
import { UserErrors } from '@business/module/errors/userErrors'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { INotificationServiceToken } from '@business/services/notification/iNotificationService'
import { CreateOrUpdateUserNotification } from '@business/useCases/notification/createOrUpdateUserNotification'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { UpdateUserUseCase } from '@business/useCases/user/updateUser'
import { UpdateUserOperator } from '@controller/operations/user/update'
import { InputUpdateUser } from '@controller/serializers/user/update'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeNotificationService } from '@tests/mock/services/fakeNotificationService'

describe('Update User Operator', () => {
  beforeAll(() => {
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container.bind(FindByUserUseCase).toSelf().inSingletonScope()
    container.bind(UpdateUserUseCase).toSelf().inSingletonScope()
    container.bind(CreateTransactionUseCase).toSelf().inSingletonScope()
    container.bind(CreateOrUpdateUserNotification).toSelf().inSingletonScope()
    container.bind(INotificationServiceToken).to(FakeNotificationService)
    container.bind(ITransactionRepositoryToken).to(FakeTransactionRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputUpdateUser({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
    name: 'new name',
    phone: '82 981292929',
  })

  test('Should fail to update a user if transaction failed to start', async () => {
    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () =>
        left(TransactionErrors.creationError())
      )

    const sut = container.get(UpdateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TransactionErrors.creationError())
  })

  test('Should fail to update a user if user does not exists', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const sut = container.get(UpdateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.notFound())
  })

  test('Should fail to update a user if update user failed', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const updateUser = container.get(UpdateUserUseCase)
    jest
      .spyOn(updateUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.updateError()))

    const sut = container.get(UpdateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.updateError())
  })

  test('Should fail to update a user if update notification failed', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const updateUser = container.get(UpdateUserUseCase)
    jest
      .spyOn(updateUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const updateUserNotification = container.get(CreateOrUpdateUserNotification)
    jest
      .spyOn(updateUserNotification, 'exec')
      .mockImplementationOnce(async () =>
        left(NotificationErrors.createOrUpdateUserFailed())
      )

    const sut = container.get(UpdateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(NotificationErrors.createOrUpdateUserFailed())
  })

  test('Should have success to update a user', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const updateUser = container.get(UpdateUserUseCase)
    jest
      .spyOn(updateUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const sut = container.get(UpdateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
