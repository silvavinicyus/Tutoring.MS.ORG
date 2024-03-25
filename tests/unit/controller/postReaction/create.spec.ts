import { PostErrors } from '@business/module/errors/postErrors'
import { PostReactionErrors } from '@business/module/errors/postReactionErrors'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { IPostRepositoryToken } from '@business/repositories/post/iPostRepository'
import { IPostReactionRepositoryToken } from '@business/repositories/postReaction/iPostReactionRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { CreatePostReactionUseCase } from '@business/useCases/postReaction/createPostReaction'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { CreatePostReactionOperator } from '@controller/operations/postReaction/create'
import { InputCreatePostReaction } from '@controller/serializers/postReaction/create'
import { PostReactionTypes } from '@domain/entities/postReactions'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakePostEntity } from '@tests/mock/entities/fakePostEntity'
import { fakePostReactionEntity } from '@tests/mock/entities/fakePostReactionEntity'
import { FakePostReactionRepository } from '@tests/mock/repositories/fakePostReactionRepository'
import { FakePostRepository } from '@tests/mock/repositories/fakePostRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Create Post Reaction Operator', () => {
  beforeAll(() => {
    container
      .bind(IPostRepositoryToken)
      .to(FakePostRepository)
      .inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
    container
      .bind(IPostReactionRepositoryToken)
      .to(FakePostReactionRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container.bind(CreatePostReactionUseCase).toSelf().inSingletonScope()
    container.bind(FindByPostUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputCreatePostReaction({
    post_uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
    type: PostReactionTypes.HAHA,
    user_id: 1,
  })

  test('Should fail to create a post reaction if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(CreatePostReactionOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to create a post reaction if post does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findPost, 'exec')
      .mockImplementationOnce(async () => left(PostErrors.notFound()))

    const sut = container.get(CreatePostReactionOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostErrors.notFound())
  })

  test('Should fail to create a post reaction if post reaction creation failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findPost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const createPostReaction = container.get(CreatePostReactionUseCase)
    jest
      .spyOn(createPostReaction, 'exec')
      .mockImplementationOnce(async () =>
        left(PostReactionErrors.creationError())
      )

    const sut = container.get(CreatePostReactionOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostReactionErrors.creationError())
  })

  test('Should have success to create a post reaction', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findPost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const createPostReaction = container.get(CreatePostReactionUseCase)
    jest
      .spyOn(createPostReaction, 'exec')
      .mockImplementationOnce(async () => right(fakePostReactionEntity))

    const sut = container.get(CreatePostReactionOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
