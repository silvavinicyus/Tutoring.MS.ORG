import { ContainerModule, interfaces } from 'inversify'
import { CreateUserUseCase } from '@business/useCases/user/createUser'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsers'
import { UpdateUserUseCase } from '@business/useCases/user/updateUser'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUser'
import { CreateStudyGroupUseCase } from '@business/useCases/studyGroup/createStudyGroup'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { FindAllStudyGroupsUseCase } from '@business/useCases/studyGroup/findAllStudyGroups'
import { DeleteStudyGroupUseCase } from '@business/useCases/studyGroup/deleteStudyGroup'
import { CreatePostUseCase } from '@business/useCases/post/createPost'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { FindAllPostsUseCase } from '@business/useCases/post/findAllPosts'
import { DeletePostUseCase } from '@business/useCases/post/deletePost'
import { UpdatePostUseCase } from '@business/useCases/post/updatePost'
import { CreatePostReactionUseCase } from '@business/useCases/postReaction/createPostReaction'
import { FindAllPostReactionsUseCase } from '@business/useCases/postReaction/findAllPostReactions'
import { FindByPostReactionUseCase } from '@business/useCases/postReaction/findByPostReaction'
import { DeletePostReactionUseCase } from '@business/useCases/postReaction/deletePostReaction'
import { CreateStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/createStudyGroupLeader'
import { FindAllStudyGroupLeadersUseCase } from '@business/useCases/studyGroupLeader/findAllStudyGroupLeaders'
import { FindByStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/findByStudyGroupLeader'
import { DeleteStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/deleteStudyGroupLeader'

export const useCaseModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(VerifyProfileUseCase).toSelf()

  bind(CreateTransactionUseCase).toSelf()

  bind(CreateUserUseCase).toSelf()
  bind(FindByUserUseCase).toSelf()
  bind(FindAllUsersUseCase).toSelf()
  bind(UpdateUserUseCase).toSelf()
  bind(DeleteUserUseCase).toSelf()

  bind(CreateStudyGroupUseCase).toSelf()
  bind(FindStudyGroupByUseCase).toSelf()
  bind(FindAllStudyGroupsUseCase).toSelf()
  bind(DeleteStudyGroupUseCase).toSelf()

  bind(CreatePostUseCase).toSelf()
  bind(FindByPostUseCase).toSelf()
  bind(FindAllPostsUseCase).toSelf()
  bind(DeletePostUseCase).toSelf()
  bind(UpdatePostUseCase).toSelf()

  bind(CreatePostReactionUseCase).toSelf()
  bind(FindAllPostReactionsUseCase).toSelf()
  bind(FindByPostReactionUseCase).toSelf()
  bind(DeletePostReactionUseCase).toSelf()

  bind(CreateStudyGroupLeaderUseCase).toSelf()
  bind(FindAllStudyGroupLeadersUseCase).toSelf()
  bind(FindByStudyGroupLeaderUseCase).toSelf()
  bind(DeleteStudyGroupLeaderUseCase).toSelf()
})
