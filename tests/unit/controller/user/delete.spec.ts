import { NotificationErrors } from '@business/module/errors/notificationErrors'
import { TransactionErrors } from '@business/module/errors/transactionErrors'
import { UserErrors } from '@business/module/errors/userErrors'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { INotificationServiceToken } from '@business/services/notification/iNotificationService'
import { CreateOrUpdateUserNotification } from '@business/useCases/notification/createOrUpdateUserNotification'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUser'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { DeleteUserOperator } from '@controller/operations/user/delete'
import { InputDeleteUser } from '@controller/serializers/user/delete'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeNotificationService } from '@tests/mock/services/fakeNotificationService'

describe('Delete User Operator', () => {
  beforeAll(() => {
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container.bind(DeleteUserUseCase).toSelf().inSingletonScope()
    container.bind(FindByUserUseCase).toSelf().inSingletonScope()
    container.bind(CreateTransactionUseCase).toSelf().inSingletonScope()
    container.bind(CreateOrUpdateUserNotification).toSelf().inSingletonScope()
    container.bind(INotificationServiceToken).to(FakeNotificationService)
    container.bind(ITransactionRepositoryToken).to(FakeTransactionRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputDeleteUser({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to delete a user if transaction failed to start', async () => {
    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () =>
        left(TransactionErrors.creationError())
      )

    const sut = container.get(DeleteUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TransactionErrors.creationError())
  })

  test('Should fail to delete a user if was not found', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const sut = container.get(DeleteUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.notFound())
  })

  test('Should fail to delete a user if delete failed', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const deleteUser = container.get(DeleteUserUseCase)
    jest
      .spyOn(deleteUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.deleteFailed()))

    const sut = container.get(DeleteUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.deleteFailed())
  })

  test('Should fail to delete a user if delete notification failed', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const deleteUser = container.get(DeleteUserUseCase)
    jest
      .spyOn(deleteUser, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const deleteUserNotification = container.get(CreateOrUpdateUserNotification)
    jest
      .spyOn(deleteUserNotification, 'exec')
      .mockImplementationOnce(async () =>
        left(NotificationErrors.createOrUpdateUserFailed())
      )

    const sut = container.get(DeleteUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(NotificationErrors.createOrUpdateUserFailed())
  })

  test('Should have success to delete a user', async () => {
    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const deleteUser = container.get(DeleteUserUseCase)
    jest
      .spyOn(deleteUser, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(DeleteUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
