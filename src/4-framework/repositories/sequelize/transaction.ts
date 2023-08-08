import {
  ICreateTransaction,
  ITransactionRepository,
} from '@business/repositories/transaction/iTransactionRepository'
import { sequelize } from '@framework/utility/database'
import { injectable } from 'inversify'
import { Transaction } from 'sequelize/types'

export type ITransaction = Transaction

@injectable()
export class TransactionRepositorySequelize implements ITransactionRepository {
  async create(): Promise<ICreateTransaction> {
    const trx = await sequelize.transaction()
    return {
      trx,
      commit: () => trx.commit(),
      rollback: () => trx.rollback(),
    }
  }
}
