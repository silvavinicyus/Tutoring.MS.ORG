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
import { UserModel } from '@framework/models/user'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class UserRepository implements IUserRepository {
  async findBy(input: IInputFindUserByDto): Promise<IUserEntity> {
    const options = createFindAllOptions(input)

    const user = await UserModel.findOne(options)

    return user.get({ plain: true })
  }

  async findAll(
    input: IInputFindAllUsersDto
  ): Promise<IPaginatedResponse<IUserEntity>> {
    const options = createFindAllOptions(input)

    const users = await UserModel.findAll(options)

    return {
      items: users.map((user) => user.get({ plain: true })),
      count: users.length,
      page: input.pagination.page || 0,
      perPage: input.pagination.count || 10,
    }
  }

  async update(
    input: IInputUpdateUser,
    trx?: ITransaction
  ): Promise<Partial<IUserEntity>> {
    await UserModel.update(input.newData, {
      where: { [input.updateWhere.column]: input.updateWhere.value },
      transaction: trx,
    })

    return input.newData as IUserEntity
  }

  async delete(input: IInputDeleteUserDto, trx?: ITransaction): Promise<void> {
    await UserModel.destroy({
      where: {
        id: input.id,
      },
      transaction: trx,
    })

    return void 0
  }

  async create(input: IUserEntity, trx?: ITransaction): Promise<IUserEntity> {
    const userResult = await UserModel.create(input, {
      transaction: trx,
    })

    return userResult.get({ plain: true })
  }
}
