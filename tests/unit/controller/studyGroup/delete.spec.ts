import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { TransactionErrors } from '@business/module/errors/transactionErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupStudentRepositoryToken } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { DeleteStudyGroupUseCase } from '@business/useCases/studyGroup/deleteStudyGroup'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { DeleteManyStudyGroupStudentsUseCase } from '@business/useCases/studyGroupStudent/deleteManyStudyGroupStudents'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { DeleteStudyGroupOperator } from '@controller/operations/studyGroup/delete'
import { InputDeleteStudyGroup } from '@controller/serializers/studyGroup/delete'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeTransaction } from '@tests/mock/entities/fakeTransactionEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeStudyGroupStudentRepository } from '@tests/mock/repositories/fakeStudyGroupStudentRepository'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Delete Study Group Operator', () => {
  beforeAll(() => {
    container.bind(DeleteStudyGroupUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
    container
      .bind(DeleteManyStudyGroupStudentsUseCase)
      .toSelf()
      .inSingletonScope()
    container.bind(CreateTransactionUseCase).toSelf().inSingletonScope()
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
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputDeleteStudyGroup({
    uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
  })

  test('Should fail to delete a study group if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(DeleteStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to delete a study group if study group does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(DeleteStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to delete a study group if create transaction failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () =>
        left(TransactionErrors.creationError())
      )

    const sut = container.get(DeleteStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TransactionErrors.creationError())
  })

  test('Should fail to delete a study group if failed to delete its students', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const deleteStudents = container.get(DeleteManyStudyGroupStudentsUseCase)
    jest
      .spyOn(deleteStudents, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.deleteFailed())
      )

    const sut = container.get(DeleteStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.deleteFailed())
  })

  test('Should fail to delete a study group if failed to delete the study group', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const deleteStudents = container.get(DeleteManyStudyGroupStudentsUseCase)
    jest
      .spyOn(deleteStudents, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const deleteStudyGroup = container.get(DeleteStudyGroupUseCase)
    jest
      .spyOn(deleteStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.deleteFailed()))

    const sut = container.get(DeleteStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.deleteFailed())
  })

  test('Should have success to delete a study group', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const deleteStudents = container.get(DeleteManyStudyGroupStudentsUseCase)
    jest
      .spyOn(deleteStudents, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const deleteStudyGroup = container.get(DeleteStudyGroupUseCase)
    jest
      .spyOn(deleteStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(DeleteStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
