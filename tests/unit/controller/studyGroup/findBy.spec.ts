import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { FindByStudyGroupOperator } from '@controller/operations/studyGroup/findBy'
import { InputFindStudyGroupBy } from '@controller/serializers/studyGroup/findBy'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Find by Study Groups Operator', () => {
  beforeAll(() => {
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
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

  const input = new InputFindStudyGroupBy({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to find by study groups if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(FindByStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to find by study groups if find by failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findBy = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findBy, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.loadFailed()))

    const sut = container.get(FindByStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.loadFailed())
  })

  test('Should have success to find by study groups', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findBy = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findBy, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const sut = container.get(FindByStudyGroupOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
