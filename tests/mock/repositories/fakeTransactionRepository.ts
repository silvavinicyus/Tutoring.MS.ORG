import { injectable } from 'inversify'
import {
  ICreateTransaction,
  ITransactionRepository,
} from '@business/repositories/transaction/iTransactionRepository'

export const fakeTransactionRepositoryCommit = jest.fn(async () => void 0)
export const fakeTransactionRepositoryRollback = jest.fn(async () => void 0)

@injectable()
export class FakeTransactionRepository implements ITransactionRepository {
  async create(): Promise<ICreateTransaction> {
    return {
      trx: void 0,
      commit: fakeTransactionRepositoryCommit,
      rollback: fakeTransactionRepositoryRollback,
    }
  }
}

export const fakeTransactionRepositoryCreate = jest.spyOn(
  FakeTransactionRepository.prototype,
  'create'
)
