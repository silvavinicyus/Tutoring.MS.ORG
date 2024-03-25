import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupLeaderRepositoryToken } from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { DeleteStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/deleteStudyGroupLeader'
import { FindByStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/findByStudyGroupLeader'
import { DeleteStudyGroupLeaderOperator } from '@controller/operations/studyGroupLeader/delete'
import { InputDeleteStudyGroupLeader } from '@controller/serializers/studyGroupLeader/delete'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeStudyGroupLeaderEntity } from '@tests/mock/entities/fakeStudyGroupLeaderEntity'
import { FakeStudyGroupLeaderRepository } from '@tests/mock/repositories/fakeStudyGroupLeaderRepository'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Delete Study Group Leader Operator', () => {
  beforeAll(() => {
    container.bind(DeleteStudyGroupLeaderUseCase).toSelf().inSingletonScope()
    container.bind(FindByStudyGroupLeaderUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
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

  const input = new InputDeleteStudyGroupLeader({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to delete a study group leader if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(DeleteStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to delete a study group leader if failed to find study group leader', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupLeaderErrors.notFound())
      )

    const sut = container.get(DeleteStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupLeaderErrors.notFound())
  })

  test('Should fail to delete a study group leader if failed to find leaders study group', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupLeaderEntity))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(DeleteStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to delete a study group leader if authorizer aint the creator', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupLeaderEntity))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () =>
        right({ ...fakeStudyGroupEntity, creator_id: 2 })
      )

    const sut = container.get(DeleteStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to delete a study group leader if failed to delete leader', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupLeaderEntity))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const deleteLeader = container.get(DeleteStudyGroupLeaderUseCase)
    jest
      .spyOn(deleteLeader, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupLeaderErrors.deleteFailed())
      )

    const sut = container.get(DeleteStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupLeaderErrors.deleteFailed())
  })

  test('Should have success to delete a study group leader', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findGroupLeader = container.get(FindByStudyGroupLeaderUseCase)
    jest
      .spyOn(findGroupLeader, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupLeaderEntity))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const deleteLeader = container.get(DeleteStudyGroupLeaderUseCase)
    jest
      .spyOn(deleteLeader, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(DeleteStudyGroupLeaderOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
