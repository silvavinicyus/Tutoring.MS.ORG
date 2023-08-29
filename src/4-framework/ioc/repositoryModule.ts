import { ContainerModule, interfaces } from 'inversify'
import { UserRepository } from '@framework/repositories/sequelize/user'
import {
  IUserRepository,
  IUserRepositoryToken,
} from '@business/repositories/user/iUserRepository'
import {
  ITransactionRepository,
  ITransactionRepositoryToken,
} from '@business/repositories/transaction/iTransactionRepository'
import { TransactionRepositorySequelize } from '@framework/repositories/sequelize/transaction'

export const repositoryModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IUserRepository>(IUserRepositoryToken).to(UserRepository)

  bind<ITransactionRepository>(ITransactionRepositoryToken).to(
    TransactionRepositorySequelize
  )
})
