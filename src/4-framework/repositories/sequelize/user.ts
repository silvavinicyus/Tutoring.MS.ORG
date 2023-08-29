import { inject, injectable } from 'inversify'
import { IUserEntity } from '@domain/entities/user'
import { IUserRepository } from '@business/repositories/user/iUserRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { Either, left, right } from '@shared/either'
import { IError } from '@shared/IError'
import { UserErrors } from '@business/module/errors/userErrors'
import { UserModel } from '@framework/models/user'
import { ITransaction } from './transaction'

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async create(
    input: IUserEntity,
    trx?: ITransaction
  ): Promise<Either<IError, IUserEntity>> {
    try {
      const userResult = await UserModel.create(input, {
        transaction: trx,
      })

      return right(userResult.get({ plain: true }))
    } catch (err) {
      this.loggerService.error(err)
      return left(UserErrors.creationError())
    }
  }
}
