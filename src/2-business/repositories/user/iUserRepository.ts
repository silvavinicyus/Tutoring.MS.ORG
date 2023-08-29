import { ITransaction } from '@business/dto/transaction/create'
import { IUserEntity } from '@domain/entities/user'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'

export const IUserRepositoryToken = Symbol.for('UserRepositorySymbol')

export interface IUserRepository {
  create(
    input: IUserEntity,
    trx?: ITransaction
  ): Promise<Either<IError, IUserEntity>>
}
