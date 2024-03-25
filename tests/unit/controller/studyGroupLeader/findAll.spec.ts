import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupLeaderRepositoryToken } from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { FindAllStudyGroupLeadersUseCase } from '@business/useCases/studyGroupLeader/findAllStudyGroupLeaders'
import { FindAllStudyGroupLeadersOperator } from '@controller/operations/studyGroupLeader/findAll'
import { InputFindAllStudyGroupLeaders } from '@controller/serializers/studyGroupLeader/findAll'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeStudyGroupLeaderRepository } from '@tests/mock/repositories/fakeStudyGroupLeaderRepository'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Find all Study Group Leaders Operator', () => {
  beforeAll(() => {
    container.bind(FindAllStudyGroupLeadersUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupLeaderRepositoryToken)
      .to(FakeStudyGroupLeaderRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputFindAllStudyGroupLeaders({
    group_uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
    contains: [],
  })

  test('Should fail to find all study group leaders if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(FindAllStudyGroupLeadersOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to find all study group leaders if study group does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(FindAllStudyGroupLeadersOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to find all study group leaders if failed to find all leaders', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findAllLeaders = container.get(FindAllStudyGroupLeadersUseCase)
    jest
      .spyOn(findAllLeaders, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupLeaderErrors.loadFailed())
      )

    const sut = container.get(FindAllStudyGroupLeadersOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupLeaderErrors.loadFailed())
  })

  test('Should have success to find all study group leaders', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findAllLeaders = container.get(FindAllStudyGroupLeadersUseCase)
    jest.spyOn(findAllLeaders, 'exec').mockImplementationOnce(async () =>
      right({
        count: 1,
        items: [fakeUserEntity],
        page: 0,
        perPage: 10,
      })
    )

    const sut = container.get(FindAllStudyGroupLeadersOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
