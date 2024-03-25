import { injectable } from 'inversify'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IInputDeleteUserDto } from '@business/dto/user/delete'
import { IInputFindAllUsersDto } from '@business/dto/user/findAll'
import { IInputFindUserByDto } from '@business/dto/user/findBy'
import {
  IInputUpdateUser,
  IUserRepository,
} from '@business/repositories/user/iUserRepository'
import { IUserEntity } from '@domain/entities/user'

@injectable()
export class FakeUserRepository implements IUserRepository {
  create(_input: IUserEntity): Promise<IUserEntity> {
    return void 0
  }
  findBy(_input: IInputFindUserByDto): Promise<IUserEntity> {
    return void 0
  }
  findAll(
    _input: IInputFindAllUsersDto
  ): Promise<IPaginatedResponse<IUserEntity>> {
    return void 0
  }
  update(_input: IInputUpdateUser): Promise<Partial<IUserEntity>> {
    return void 0
  }
  delete(_input: IInputDeleteUserDto): Promise<void> {
    return void 0
  }
}

export const fakeUserRepositoryUpdate = jest.spyOn(
  FakeUserRepository.prototype,
  'update'
)

export const fakeUserRepositoryFindAll = jest.spyOn(
  FakeUserRepository.prototype,
  'findAll'
)

export const fakeUserRepositoryFindBy = jest.spyOn(
  FakeUserRepository.prototype,
  'findBy'
)

export const fakeUserRepositoryDelete = jest.spyOn(
  FakeUserRepository.prototype,
  'delete'
)

export const fakeUserRepositoryCreate = jest.spyOn(
  FakeUserRepository.prototype,
  'create'
)
