import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupRequestErrors } from '@business/module/errors/studyGroupRequestErrors'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { TransactionErrors } from '@business/module/errors/transactionErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupRequestRepositoryToken } from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import { IStudyGroupStudentRepositoryToken } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { DeleteStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/deleteStudyGroupRequest'
import { FindByStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/findbyStudyGroupRequest'
import { CreateStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/createStudyGroupStudent'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { AnswerRequestToJoinStudyGroupOperator } from '@controller/operations/studyGroupStudent/answerRequestToJoin'
import { InputAnswerRequestToJoinStudyGroup } from '@controller/serializers/studyGroupStudent/answerRequestToJoin'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeStudyGroupRequestEntity } from '@tests/mock/entities/fakeStudyGroupRequestEntity'
import { fakeStudyGroupStudentEntity } from '@tests/mock/entities/fakeStudyGroupStudentEntity'
import { fakeTransaction } from '@tests/mock/entities/fakeTransactionEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeStudyGroupRequestRepository } from '@tests/mock/repositories/fakeStudyGroupRequestRepository'
import { FakeStudyGroupStudentRepository } from '@tests/mock/repositories/fakeStudyGroupStudentRepository'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Answer Request To Join Operator', () => {
  beforeAll(() => {
    container.bind(CreateTransactionUseCase).toSelf().inSingletonScope()
    container.bind(DeleteStudyGroupRequestUseCase).toSelf().inSingletonScope()
    container.bind(CreateStudyGroupStudentUseCase).toSelf().inSingletonScope()
    container.bind(FindByStudyGroupRequestUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
    container
      .bind(ITransactionRepositoryToken)
      .to(FakeTransactionRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupStudentRepositoryToken)
      .to(FakeStudyGroupStudentRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupRequestRepositoryToken)
      .to(FakeStudyGroupRequestRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputAnswerRequestToJoinStudyGroup({
    answer: true,
    group_request_uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
  })

  const inputDeny = new InputAnswerRequestToJoinStudyGroup({
    answer: false,
    group_request_uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
  })

  test('Should fail to answer a request to join if request was not found', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupRequestErrors.notFound())
      )

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupRequestErrors.notFound())
  })

  test('Should fail to answer a request to join if study group was not found', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const findGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to answer a request to join if authorizer aint the group leader or group creator', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const findGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 2,
        leaders: [{ ...fakeUserEntity, id: 3 }],
      })
    )

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('[DENY] Should fail to answer a request to join if delete request failed', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const findGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [fakeUserEntity],
      })
    )

    const deleteRequest = container.get(DeleteStudyGroupRequestUseCase)
    jest
      .spyOn(deleteRequest, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupRequestErrors.deleteFailed())
      )

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(inputDeny, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupRequestErrors.deleteFailed())
  })

  test('[DENY] Should have success to answer a request to join', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const findGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [fakeUserEntity],
      })
    )

    const deleteRequest = container.get(DeleteStudyGroupRequestUseCase)
    jest
      .spyOn(deleteRequest, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(inputDeny, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })

  test('Should fail to answer a request to join if transaction failed to create', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const findGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [{ ...fakeUserEntity, id: 3 }],
      })
    )

    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () =>
        left(TransactionErrors.creationError())
      )

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TransactionErrors.creationError())
  })

  test('Should fail to answer a request to join if failed to create group student', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const findGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [{ ...fakeUserEntity, id: 3 }],
      })
    )

    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const createGroupStudent = container.get(CreateStudyGroupStudentUseCase)
    jest
      .spyOn(createGroupStudent, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.creationError())
      )

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.creationError())
  })

  test('Should fail to answer a request to join if failed to delete group request', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const findGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [{ ...fakeUserEntity, id: 3 }],
      })
    )

    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const createGroupStudent = container.get(CreateStudyGroupStudentUseCase)
    jest
      .spyOn(createGroupStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const deleteGroupRequest = container.get(DeleteStudyGroupRequestUseCase)
    jest
      .spyOn(deleteGroupRequest, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupRequestErrors.deleteFailed())
      )

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupRequestErrors.deleteFailed())
  })

  test('Should have success to answer a request to join', async () => {
    const findRequest = container.get(FindByStudyGroupRequestUseCase)
    jest
      .spyOn(findRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const findGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [{ ...fakeUserEntity, id: 3 }],
      })
    )

    const createTransaction = container.get(CreateTransactionUseCase)
    jest
      .spyOn(createTransaction, 'exec')
      .mockImplementationOnce(async () => right(fakeTransaction))

    const createGroupStudent = container.get(CreateStudyGroupStudentUseCase)
    jest
      .spyOn(createGroupStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const deleteGroupRequest = container.get(DeleteStudyGroupRequestUseCase)
    jest
      .spyOn(deleteGroupRequest, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(AnswerRequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
