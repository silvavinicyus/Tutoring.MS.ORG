import { ITransaction } from '@business/dto/transaction/create'
import { IFooEntity } from '@domain/entities/foo'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'

export const IFooRepositoryToken = Symbol.for('FooRepositorySymbol')

export interface IFooRepository {
  create(
    input: IFooEntity,
    trx?: ITransaction
  ): Promise<Either<IError, IFooEntity>>
}
