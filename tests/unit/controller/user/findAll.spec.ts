import { UserErrors } from '@business/module/errors/userErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsers'
import { FindAllUsersOperator } from '@controller/operations/user/findAll'
import { InputFindAllUsers } from '@controller/serializers/user/findAll'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Find all User Operator', () => {
  beforeAll(() => {
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container.bind(FindAllUsersUseCase).toSelf().inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputFindAllUsers({
    contains: [],
  })

  test('Should fail to find all users if find all operation failed', async () => {
    const findByUser = container.get(FindAllUsersUseCase)
    jest
      .spyOn(findByUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.loadFailed()))

    const sut = container.get(FindAllUsersOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.loadFailed())
  })

  test('Should have success to find all users', async () => {
    const findByUser = container.get(FindAllUsersUseCase)
    jest.spyOn(findByUser, 'exec').mockImplementationOnce(async () =>
      right({
        count: 1,
        items: [fakeUserEntity],
        page: 0,
        perPage: 10,
      })
    )

    const sut = container.get(FindAllUsersOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
