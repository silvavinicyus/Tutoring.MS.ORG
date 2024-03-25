import { UserErrors } from '@business/module/errors/userErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { FindUserByOperator } from '@controller/operations/user/findBy'
import { InputFindUserBy } from '@controller/serializers/user/findBy'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Find by User Operator', () => {
  beforeAll(() => {
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container.bind(FindByUserUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputFindUserBy({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to find a user if user does not exists', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const sut = container.get(FindUserByOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.notFound())
  })

  test('Should have success to find a user', async () => {
    const findByUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const sut = container.get(FindUserByOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
