import { PostErrors } from '@business/module/errors/postErrors'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { IPostRepositoryToken } from '@business/repositories/post/iPostRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { FindAllPostsUseCase } from '@business/useCases/post/findAllPosts'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindAllPostsOperator } from '@controller/operations/post/findAll'
import { InputFindAllPosts } from '@controller/serializers/post/findAll'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakePostEntity } from '@tests/mock/entities/fakePostEntity'
import { FakePostRepository } from '@tests/mock/repositories/fakePostRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Find all Posts Operator', () => {
  beforeAll(() => {
    container
      .bind(IPostRepositoryToken)
      .to(FakePostRepository)
      .inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container.bind(FindAllPostsUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputFindAllPosts({
    contains: [],
  })

  test('Should fail to find all posts if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(FindAllPostsOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to find all posts if find all failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findAllPosts = container.get(FindAllPostsUseCase)
    jest
      .spyOn(findAllPosts, 'exec')
      .mockImplementationOnce(async () => left(PostErrors.loadFailed()))

    const sut = container.get(FindAllPostsOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostErrors.loadFailed())
  })

  test('Should fail to find all posts if find all failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findAllPosts = container.get(FindAllPostsUseCase)
    jest.spyOn(findAllPosts, 'exec').mockImplementationOnce(async () =>
      right({
        count: 1,
        items: [fakePostEntity],
        page: 0,
        perPage: 10,
      })
    )

    const sut = container.get(FindAllPostsOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
