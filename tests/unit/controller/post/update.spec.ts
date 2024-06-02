import { PostErrors } from '@business/module/errors/postErrors'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { IPostRepositoryToken } from '@business/repositories/post/iPostRepository'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { UpdatePostUseCase } from '@business/useCases/post/updatePost'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { UpdatePostOperator } from '@controller/operations/post/update'
import { InputUpdatePost } from '@controller/serializers/post/update'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakePostEntity } from '@tests/mock/entities/fakePostEntity'
import { FakePostRepository } from '@tests/mock/repositories/fakePostRepository'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Update Post Operator', () => {
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
    container.bind(UpdatePostUseCase).toSelf().inSingletonScope()
    container.bind(FindByPostUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputUpdatePost({
    content: 'content',
    title: 'title',
    uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
  })

  test('Should fail to update a post if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(UpdatePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to update a post if post does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findByPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findByPost, 'exec')
      .mockImplementationOnce(async () => left(PostErrors.notFound()))

    const sut = container.get(UpdatePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostErrors.notFound())
  })

  test('Should fail to update a post if post creation failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findByPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findByPost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const updatePost = container.get(UpdatePostUseCase)
    jest
      .spyOn(updatePost, 'exec')
      .mockImplementationOnce(async () => left(PostErrors.updateError()))

    const sut = container.get(UpdatePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostErrors.updateError())
  })

  test('Should have success to update a post', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findByPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findByPost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const updatePost = container.get(UpdatePostUseCase)
    jest
      .spyOn(updatePost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const sut = container.get(UpdatePostOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
