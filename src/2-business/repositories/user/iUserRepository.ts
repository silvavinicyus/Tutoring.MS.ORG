import { ITransaction } from '@business/dto/transaction/create'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IInputDeleteUserDto } from '@business/dto/user/delete'
import { IInputFindAllUsersDto } from '@business/dto/user/findAll'
import { IInputFindUserByDto } from '@business/dto/user/findBy'
import { IInputUpdateUserDto } from '@business/dto/user/update'
import { IUserEntity, UserEntityKeys } from '@domain/entities/user'
import { IWhere } from '../where'

export const IUserRepositoryToken = Symbol.for('UserRepositorySymbol')

export type updateWhereUser = IWhere<keyof UserEntityKeys, string | number>
export interface IInputUpdateUser {
  updateWhere: updateWhereUser
  newData: IInputUpdateUserDto
}

export interface IUserRepository {
  create(input: IUserEntity, trx?: ITransaction): Promise<IUserEntity>
  findBy(input: IInputFindUserByDto): Promise<IUserEntity>
  findAll(
    input: IInputFindAllUsersDto
  ): Promise<IPaginatedResponse<IUserEntity>>
  update(
    input: IInputUpdateUser,
    trx?: ITransaction
  ): Promise<Partial<IUserEntity>>
  delete(input: IInputDeleteUserDto, trx?: ITransaction): Promise<void>
}
