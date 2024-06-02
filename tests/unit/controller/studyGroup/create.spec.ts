import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { TransactionErrors } from '@business/module/errors/transactionErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupStudentRepositoryToken } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { INotificationServiceToken } from '@business/services/notification/iNotificationService'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { CreateStudyGroupUseCase } from '@business/useCases/studyGroup/createStudyGroup'
import { CreateStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/createStudyGroupStudent'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { CreateStudyGroupOperator } from '@controller/operations/studyGroup/create'
import { InputCreateStudyGroup } from '@controller/serializers/studyGroup/create'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeStudyGroupStudentEntity } from '@tests/mock/entities/fakeStudyGroupStudentEntity'
import { fakeTransaction } from '@tests/mock/entities/fakeTransactionEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeStudyGroupStudentRepository } from '@tests/mock/repositories/fakeStudyGroupStudentRepository'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeNotificationService } from '@tests/mock/services/fakeNotificationService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Create Study Group Operator', () => {
  beforeAll(() => {
    container.bind(CreateStudyGroupUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
    container.bind(CreateTransactionUseCase).toSelf().inSingletonScope()
    container.bind(CreateStudyGroupStudentUseCase).toSelf().inSingletonScope()
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container
      .bind(ITransactionRepositoryToken)
      .to(FakeTransactionRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupStudentRepositoryToken)
      .to(FakeStudyGroupStudentRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
    container.bind(INotificationServiceToken).to(FakeNotificationService)
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputCreateStudyGroup({
    name: 'study group',
    subject: 'subject',
  })

  test('Should fail to create a study group if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(CreateStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to create a study group if transaction failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const transaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(transaction, 'exec')
      .mockImplementationOnce(async () =>
        left(TransactionErrors.creationError())
      )

    const sut = container.get(CreateStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TransactionErrors.creationError())
  })

  test('Should fail to create a study group if create study group failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const transaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(transaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const createStudyGroup = container.get(CreateStudyGroupUseCase)
    jest
      .spyOn(createStudyGroup, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupErrors.creationError())
      )

    const sut = container.get(CreateStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.creationError())
  })

  test('Should fail to create a study group if create study group student failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const transaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(transaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const createStudyGroup = container.get(CreateStudyGroupUseCase)
    jest
      .spyOn(createStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const createStudyGroupStudent = container.get(
      CreateStudyGroupStudentUseCase
    )
    jest
      .spyOn(createStudyGroupStudent, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.creationError())
      )

    const sut = container.get(CreateStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.creationError())
  })

  test('Should have success to create a study group', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const transaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(transaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const createStudyGroup = container.get(CreateStudyGroupUseCase)
    jest
      .spyOn(createStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const createStudyGroupStudent = container.get(
      CreateStudyGroupStudentUseCase
    )
    jest
      .spyOn(createStudyGroupStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const sut = container.get(CreateStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
