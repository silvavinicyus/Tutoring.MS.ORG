import { IFooRepository, IFooRepositoryToken } from '@business/repositories/foo/iFooRepository'
import {
  ITransactionRepository,
  ITransactionRepositoryToken
} from '@business/repositories/transaction/iTransactionRepository'
import { FooRepositorySequelize } from '@framework/repositories/sequelize/foo'
import { TransactionRepositorySequelize } from '@framework/repositories/sequelize/transaction'
import { ContainerModule, interfaces } from 'inversify'

export const repositoryModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IFooRepository>(IFooRepositoryToken).to(
    FooRepositorySequelize
  )

  bind<ITransactionRepository>(ITransactionRepositoryToken).to(
    TransactionRepositorySequelize
  )
  
})
