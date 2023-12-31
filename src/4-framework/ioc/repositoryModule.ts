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
import {
  IPostReactionRepository,
  IPostReactionRepositoryToken,
} from '@business/repositories/postReaction/iPostReactionRepository'
import { PostReactionRepository } from '@framework/repositories/sequelize/postReaction'
import {
  IStudyGroupLeaderRepository,
  IStudyGroupLeaderRepositoryToken,
} from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import { StudyGroupLeaderRepository } from '@framework/repositories/sequelize/studyGroupLeader'
import {
  IStudyGroupStudentRepository,
  IStudyGroupStudentRepositoryToken,
} from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { StudyGroupStudentRepository } from '@framework/repositories/sequelize/studyGroupStudent'
import {
  IStudyGroupRequestRepository,
  IStudyGroupRequestRepositoryToken,
} from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import { StudyGroupRequestRepository } from '@framework/repositories/sequelize/studyGroupRequest'
import {
  ITutoringRepository,
  ITutoringRepositoryToken,
} from '@business/repositories/tutoring/iTutoringRepository'
import { TutoringRepository } from '@framework/repositories/sequelize/tutoring'
import {
  IFileRepository,
  IFileRepositoryToken,
} from '@business/repositories/file/iFileRepository'
import { FileRepository } from '@framework/repositories/sequelize/file'

export const repositoryModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IUserRepository>(IUserRepositoryToken).to(UserRepository)

  bind<ITransactionRepository>(ITransactionRepositoryToken).to(
    TransactionRepositorySequelize
  )

  bind<IStudyGroupRepository>(IStudyGroupRepositoryToken).to(
    StudyGroupRepository
  )

  bind<IPostRepository>(IPostRepositoryToken).to(PostRepository)

  bind<IPostReactionRepository>(IPostReactionRepositoryToken).to(
    PostReactionRepository
  )

  bind<IStudyGroupLeaderRepository>(IStudyGroupLeaderRepositoryToken).to(
    StudyGroupLeaderRepository
  )

  bind<IStudyGroupStudentRepository>(IStudyGroupStudentRepositoryToken).to(
    StudyGroupStudentRepository
  )

  bind<IStudyGroupRequestRepository>(IStudyGroupRequestRepositoryToken).to(
    StudyGroupRequestRepository
  )

  bind<ITutoringRepository>(ITutoringRepositoryToken).to(TutoringRepository)

  bind<IFileRepository>(IFileRepositoryToken).to(FileRepository)
})
