import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindAllStudyGroupsUseCase } from '@business/useCases/studyGroup/findAllStudyGroups'
import { FindAllStudyGroupsOperator } from '@controller/operations/studyGroup/findAll'
import { InputFindAllStudyGroups } from '@controller/serializers/studyGroup/findAll'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Find all Study Groups Operator', () => {
  beforeAll(() => {
    container.bind(FindAllStudyGroupsUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputFindAllStudyGroups({
    contains: [],
  })

  test('Should fail to find all study groups if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(FindAllStudyGroupsOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to find all study groups if find all failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findAll = container.get(FindAllStudyGroupsUseCase)
    jest
      .spyOn(findAll, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.loadFailed()))

    const sut = container.get(FindAllStudyGroupsOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.loadFailed())
  })

  test('Should have success to find all study groups', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findAll = container.get(FindAllStudyGroupsUseCase)
    jest.spyOn(findAll, 'exec').mockImplementationOnce(async () =>
      right({
        count: 1,
        items: [fakeStudyGroupEntity],
        perPage: 10,
        page: 0,
      })
    )

    const sut = container.get(FindAllStudyGroupsOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
