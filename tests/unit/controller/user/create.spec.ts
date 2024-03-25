import { NotificationErrors } from '@business/module/errors/notificationErrors'
import { TransactionErrors } from '@business/module/errors/transactionErrors'
import { UserErrors } from '@business/module/errors/userErrors'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { INotificationServiceToken } from '@business/services/notification/iNotificationService'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateUserNotification } from '@business/useCases/notification/createUserNotification'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { CreateUserUseCase } from '@business/useCases/user/createUser'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { CreateUserOperator } from '@controller/operations/user/create'
import { InputCreateUser } from '@controller/serializers/user/create'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeTransaction } from '@tests/mock/entities/fakeTransactionEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeNotificationService } from '@tests/mock/services/fakeNotificationService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Create User Operator', () => {
  beforeAll(() => {
    container
      .bind(ITransactionRepositoryToken)
      .to(FakeTransactionRepository)
      .inSingletonScope()
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container
      .bind(INotificationServiceToken)
      .to(FakeNotificationService)
      .inSingletonScope()
    container.bind(CreateTransactionUseCase).toSelf().inSingletonScope()
    container.bind(CreateUserUseCase).toSelf().inSingletonScope()
    container.bind(FindByUserUseCase).toSelf().inSingletonScope()
    container.bind(CreateUserNotification).toSelf().inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputCreateUser({
    birthdate: new Date(),
    email: 'email@gmail.com',
    name: 'name',
    password: 'password',
    phone: 'phone',
  })

  test('Should fail to create a user if transaction failed to create', async () => {
    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () =>
        left(TransactionErrors.creationError())
      )

    const sut = container.get(CreateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TransactionErrors.creationError())
  })

  test('Should fail to create a user if user search failed', async () => {
    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.loadFailed()))

    const sut = container.get(CreateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.loadFailed())
  })

  test('Should fail to create a user if user already exists', async () => {
    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const sut = container.get(CreateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.emailAlreadyInUse())
  })

  test('Should fail to create a user if user creation failed', async () => {
    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const createUser = container.get(CreateUserUseCase)
    jest
      .spyOn(createUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.creationError()))

    const sut = container.get(CreateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.creationError())
  })

  test('Should fail to create a user if create user notification failed', async () => {
    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const createUser = container.get(CreateUserUseCase)
    jest
      .spyOn(createUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const createUserNotification = container.get(CreateUserNotification)
    jest
      .spyOn(createUserNotification, 'exec')
      .mockImplementationOnce(async () =>
        left(NotificationErrors.createUserFailed())
      )

    const sut = container.get(CreateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(NotificationErrors.createUserFailed())
  })

  test('Should have success to create a user', async () => {
    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const createUser = container.get(CreateUserUseCase)
    jest
      .spyOn(createUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const createUserNotification = container.get(CreateUserNotification)
    jest
      .spyOn(createUserNotification, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(CreateUserOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
