import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupRequestErrors } from '@business/module/errors/studyGroupRequestErrors'
import { UserErrors } from '@business/module/errors/userErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupRequestRepositoryToken } from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { CreateStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/createStudyGroupRequest'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { RequestToJoinStudyGroupOperator } from '@controller/operations/studyGroupStudent/requestToJoin'
import { InputRequestToJoinStudyGroup } from '@controller/serializers/studyGroupStudent/requestToJoin'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeStudyGroupRequestEntity } from '@tests/mock/entities/fakeStudyGroupRequestEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeStudyGroupRequestRepository } from '@tests/mock/repositories/fakeStudyGroupRequestRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Delete Study Group Student Operator', () => {
  beforeAll(() => {
    container.bind(CreateStudyGroupRequestUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
    container.bind(FindByUserUseCase).toSelf().inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupRequestRepositoryToken)
      .to(FakeStudyGroupRequestRepository)
      .inSingletonScope()
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputRequestToJoinStudyGroup({
    group_uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to request to join a group if requester was not found', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const sut = container.get(RequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.notFound())
  })

  test('Should fail to request to join a group if study group was not found', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findByGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findByGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(RequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to request to join a group if requester is a current student', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findByGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findByGroup, 'exec')
      .mockImplementationOnce(async () =>
        right({ ...fakeStudyGroupEntity, students: [fakeUserEntity] })
      )

    const sut = container.get(RequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupRequestErrors.alreadyInGroup())
  })

  test('Should fail to request to join a group if group request creation failed', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findByGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findByGroup, 'exec')
      .mockImplementationOnce(async () =>
        right({ ...fakeStudyGroupEntity, students: [] })
      )

    const createRequest = container.get(CreateStudyGroupRequestUseCase)
    jest
      .spyOn(createRequest, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupRequestErrors.creationError())
      )

    const sut = container.get(RequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupRequestErrors.creationError())
  })

  test('Should have success to request to join a group', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findByGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findByGroup, 'exec')
      .mockImplementationOnce(async () =>
        right({ ...fakeStudyGroupEntity, students: [] })
      )

    const createRequest = container.get(CreateStudyGroupRequestUseCase)
    jest
      .spyOn(createRequest, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupRequestEntity))

    const sut = container.get(RequestToJoinStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
