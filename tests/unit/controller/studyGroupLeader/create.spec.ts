import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import { UserErrors } from '@business/module/errors/userErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupLeaderRepositoryToken } from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { CreateStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/createStudyGroupLeader'
import { FindByStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/findByStudyGroupLeader'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { CreateStudyGroupLeaderOperator } from '@controller/operations/studyGroupLeader/create'
import { InputCreateStudyGroupLeader } from '@controller/serializers/studyGroupLeader/create'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeStudyGroupLeaderEntity } from '@tests/mock/entities/fakeStudyGroupLeaderEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeStudyGroupLeaderRepository } from '@tests/mock/repositories/fakeStudyGroupLeaderRepository'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Create Study Group Leader Operator', () => {
  beforeAll(() => {
    container.bind(CreateStudyGroupLeaderUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
    container.bind(FindByUserUseCase).toSelf().inSingletonScope()
    container.bind(FindByStudyGroupLeaderUseCase).toSelf().inSingletonScope()
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupLeaderRepositoryToken)
      .to(FakeStudyGroupLeaderRepository)
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

  const input = new InputCreateStudyGroupLeader({
    group_uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
    leader_uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to create a study group leader if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(CreateStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to create a study group leader if study group does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(CreateStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to create a study group leader if authorizer aint the group creator', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () =>
        right({ ...fakeStudyGroupEntity, creator_id: 2 })
      )

    const sut = container.get(CreateStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to create a study group leader if new leader does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findLeader = container.get(FindByUserUseCase)
    jest
      .spyOn(findLeader, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const sut = container.get(CreateStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.notFound())
  })

  test('Should fail to create a study group leader if failed to find if this leader already exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findLeader = container.get(FindByUserUseCase)
    jest
      .spyOn(findLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupLeaderErrors.loadFailed())
      )

    const sut = container.get(CreateStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupLeaderErrors.loadFailed())
  })

  test('Should fail to create a study group leader if this leader already exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findLeader = container.get(FindByUserUseCase)
    jest
      .spyOn(findLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupLeaderEntity))

    const sut = container.get(CreateStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupLeaderErrors.alreadyExists())
  })

  test('Should fail to create a study group leader if leader creation failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findLeader = container.get(FindByUserUseCase)
    jest
      .spyOn(findLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupLeaderErrors.notFound())
      )

    const createLeader = container.get(CreateStudyGroupLeaderUseCase)
    jest
      .spyOn(createLeader, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupLeaderErrors.creationError())
      )

    const sut = container.get(CreateStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupLeaderErrors.creationError())
  })

  test('Should have success to create a study group leader', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findLeader = container.get(FindByUserUseCase)
    jest
      .spyOn(findLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupLeaderErrors.notFound())
      )

    const createLeader = container.get(CreateStudyGroupLeaderUseCase)
    jest
      .spyOn(createLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupLeaderEntity))

    const sut = container.get(CreateStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
