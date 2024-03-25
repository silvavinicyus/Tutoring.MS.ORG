import { PostReactionErrors } from '@business/module/errors/postReactionErrors'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { IPostReactionRepositoryToken } from '@business/repositories/postReaction/iPostReactionRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { DeletePostReactionUseCase } from '@business/useCases/postReaction/deletePostReaction'
import { FindByPostReactionUseCase } from '@business/useCases/postReaction/findByPostReaction'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { DeletePostReactionOperator } from '@controller/operations/postReaction/delete'
import { InputDeletePostReaction } from '@controller/serializers/postReaction/delete'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakePostReactionEntity } from '@tests/mock/entities/fakePostReactionEntity'
import { FakePostReactionRepository } from '@tests/mock/repositories/fakePostReactionRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Delete Post Reaction Operator', () => {
  beforeAll(() => {
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
    container
      .bind(IPostReactionRepositoryToken)
      .to(FakePostReactionRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container.bind(DeletePostReactionUseCase).toSelf().inSingletonScope()
    container.bind(FindByPostReactionUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputDeletePostReaction({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to delete a post reaction if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(DeletePostReactionOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to delete a post reaction if post reaction does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPostReaction = container.get(FindByPostReactionUseCase)
    jest
      .spyOn(findPostReaction, 'exec')
      .mockImplementationOnce(async () =>
        left(PostReactionErrors.deleteFailed())
      )

    const sut = container.get(DeletePostReactionOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostReactionErrors.deleteFailed())
  })

  test('Should fail to delete a post reaction if post reaction delete failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPostReaction = container.get(FindByPostReactionUseCase)
    jest
      .spyOn(findPostReaction, 'exec')
      .mockImplementationOnce(async () => right(fakePostReactionEntity))

    const deletePostReaction = container.get(DeletePostReactionUseCase)
    jest
      .spyOn(deletePostReaction, 'exec')
      .mockImplementationOnce(async () =>
        left(PostReactionErrors.deleteFailed())
      )

    const sut = container.get(DeletePostReactionOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostReactionErrors.deleteFailed())
  })

  test('Should have success to delete a post reaction', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findPostReaction = container.get(FindByPostReactionUseCase)
    jest
      .spyOn(findPostReaction, 'exec')
      .mockImplementationOnce(async () => right(fakePostReactionEntity))

    const deletePostReaction = container.get(DeletePostReactionUseCase)
    jest
      .spyOn(deletePostReaction, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(DeletePostReactionOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
