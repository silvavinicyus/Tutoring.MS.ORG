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
import {
  IStudyGroupRepository,
  IStudyGroupRepositoryToken,
} from '@business/repositories/studyGroup/iStudyGroupRepository'
import { StudyGroupRepository } from '@framework/repositories/sequelize/studyGroup'
import {
  IPostRepository,
  IPostRepositoryToken,
} from '@business/repositories/post/iPostRepository'
import { PostRepository } from '@framework/repositories/sequelize/post'

export const repositoryModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IUserRepository>(IUserRepositoryToken).to(UserRepository)

  bind<ITransactionRepository>(ITransactionRepositoryToken).to(
    TransactionRepositorySequelize
  )

  bind<IStudyGroupRepository>(IStudyGroupRepositoryToken).to(
    StudyGroupRepository
  )

  bind<IPostRepository>(IPostRepositoryToken).to(PostRepository)
})
