import { PostErrors } from '@business/module/errors/postErrors'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { IPostRepositoryToken } from '@business/repositories/post/iPostRepository'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreatePostUseCase } from '@business/useCases/post/createPost'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { CreatePostOperator } from '@controller/operations/post/create'
import { InputCreatePost } from '@controller/serializers/post/create'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakePostEntity } from '@tests/mock/entities/fakePostEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { FakePostRepository } from '@tests/mock/repositories/fakePostRepository'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Create Post Operator', () => {
  beforeAll(() => {
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container
      .bind(IPostRepositoryToken)
      .to(FakePostRepository)
      .inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container.bind(CreatePostUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputCreatePost({
    content: 'content',
    fixed: true,
    group_id: 1,
    owner_id: 1,
    title: 'title',
  })

  test('Should fail to create a post if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(CreatePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to create a post if study group does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findByStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findByStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(CreatePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to create a post if post creation failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findByStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findByStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const createPost = container.get(CreatePostUseCase)
    jest
      .spyOn(createPost, 'exec')
      .mockImplementationOnce(async () => left(PostErrors.creationError()))

    const sut = container.get(CreatePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostErrors.creationError())
  })

  test('Should have success to create a post', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findByStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findByStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const createPost = container.get(CreatePostUseCase)
    jest
      .spyOn(createPost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const sut = container.get(CreatePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
