import { PostErrors } from '@business/module/errors/postErrors'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { IPostRepositoryToken } from '@business/repositories/post/iPostRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { DeletePostUseCase } from '@business/useCases/post/deletePost'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { DeletePostOperator } from '@controller/operations/post/delete'
import { InputDeletePost } from '@controller/serializers/post/delete'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakePostEntity } from '@tests/mock/entities/fakePostEntity'
import { FakePostRepository } from '@tests/mock/repositories/fakePostRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Delete Post Operator', () => {
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
    container.bind(DeletePostUseCase).toSelf().inSingletonScope()
    container.bind(FindByPostUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputDeletePost({
    uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
  })

  test('Should fail to delete a post if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(DeletePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to delete a post if post does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findPost, 'exec')
      .mockImplementationOnce(async () => left(PostErrors.notFound()))

    const sut = container.get(DeletePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostErrors.notFound())
  })

  test('Should fail to delete a post if post failed to delete', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findPost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const deletePost = container.get(DeletePostUseCase)
    jest
      .spyOn(deletePost, 'exec')
      .mockImplementationOnce(async () => left(PostErrors.deleteFailed()))

    const sut = container.get(DeletePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostErrors.deleteFailed())
  })

  test('Should have success to delete a post', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findPost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const deletePost = container.get(DeletePostUseCase)
    jest
      .spyOn(deletePost, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(DeletePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
