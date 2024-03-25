import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { PostErrors } from '@business/module/errors/postErrors'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { IPostRepositoryToken } from '@business/repositories/post/iPostRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindPostByOperator } from '@controller/operations/post/findBy'
import { InputFindPostBy } from '@controller/serializers/post/findBy'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakePostEntity } from '@tests/mock/entities/fakePostEntity'
import { FakePostRepository } from '@tests/mock/repositories/fakePostRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Find By Post Operator', () => {
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
    container.bind(FindByPostUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputFindPostBy({
    uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
  })

  test('Should fail to find by post if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(FindPostByOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to find by post if find by failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findByPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findByPost, 'exec')
      .mockImplementationOnce(async () => left(PostErrors.loadFailed()))

    const sut = container.get(FindPostByOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(PostErrors.loadFailed())
  })

  test('Should fail to find by post if find by failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findByPost = container.get(FindByPostUseCase)
    jest
      .spyOn(findByPost, 'exec')
      .mockImplementationOnce(async () => right(fakePostEntity))

    const sut = container.get(FindPostByOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
