import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsers'
import { IInputCreateUserDto } from '@business/dto/user/create'
import { IInputDeleteUserDto } from '@business/dto/user/delete'
import { IInputFindAllUsersDto } from '@business/dto/user/findAll'
import { IInputFindUserByDto } from '@business/dto/user/findBy'
import { IInputUpdateUserDto } from '@business/dto/user/update'
import { UserErrors } from '@business/module/errors/userErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateUserUseCase } from '@business/useCases/user/createUser'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUser'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { UpdateUserUseCase } from '@business/useCases/user/updateUser'
import { container } from '@shared/ioc/container'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import {
  FakeUserRepository,
  fakeUserRepositoryCreate,
  fakeUserRepositoryDelete,
  fakeUserRepositoryFindAll,
  fakeUserRepositoryFindBy,
  fakeUserRepositoryUpdate,
} from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('User Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Create User Use Case', () => {
    const input: IInputCreateUserDto = {
      birthdate: new Date(),
      email: 'email@email.com',
      name: 'name',
      phone: '82 981981981',
    }

    test('Should fail to create a user if repository failed', async () => {
      fakeUserRepositoryCreate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreateUserUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(UserErrors.creationError())
    })

    test('Should have success to create a user', async () => {
      fakeUserRepositoryCreate.mockImplementationOnce(
        async () => fakeUserEntity
      )

      const sut = container.get(CreateUserUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete User Use Case', () => {
    const input: IInputDeleteUserDto = {
      id: 1,
    }

    test('Should fail to delete a user if repository failed', async () => {
      fakeUserRepositoryDelete.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeleteUserUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(UserErrors.deleteFailed())
    })

    test('Should have success to delete a user', async () => {
      fakeUserRepositoryDelete.mockImplementationOnce(async () => void 0)

      const sut = container.get(DeleteUserUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Find By User Use Case', () => {
    const input: IInputFindUserByDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find by a user if repository failed', async () => {
      fakeUserRepositoryFindBy.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindByUserUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(UserErrors.loadFailed())
    })

    test('Should fail to find by a user if user does not exists', async () => {
      fakeUserRepositoryFindBy.mockImplementationOnce(async () => undefined)

      const sut = container.get(FindByUserUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(UserErrors.notFound())
    })

    test('Should have success to find by a user', async () => {
      fakeUserRepositoryFindBy.mockImplementationOnce(
        async () => fakeUserEntity
      )

      const sut = container.get(FindByUserUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Find All Users Use Case', () => {
    const input: IInputFindAllUsersDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find all users if repository failed', async () => {
      fakeUserRepositoryFindAll.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindAllUsersUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(UserErrors.loadFailed())
    })

    test('Should have success to find all users', async () => {
      fakeUserRepositoryFindAll.mockImplementationOnce(async () => ({
        count: 1,
        items: [fakeUserEntity],
        page: 0,
        perPage: 10,
      }))

      const sut = container.get(FindAllUsersUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Update User Use Case', () => {
    const input: IInputUpdateUserDto = {
      birthdate: new Date(),
      name: 'new name 1',
    }

    test('Should fail to update a user if repository failed', async () => {
      fakeUserRepositoryUpdate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(UpdateUserUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(UserErrors.updateError())
    })

    test('Should fail to update a user if repository returned empty', async () => {
      fakeUserRepositoryUpdate.mockImplementationOnce(async () => undefined)

      const sut = container.get(UpdateUserUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(UserErrors.updateError())
    })

    test('Should have success to update a user', async () => {
      fakeUserRepositoryUpdate.mockImplementationOnce(
        async () => fakeUserEntity
      )

      const sut = container.get(UpdateUserUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
