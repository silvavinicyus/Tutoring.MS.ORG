import { ContainerModule, interfaces } from 'inversify'
import { CreateUserOperator } from '@controller/operations/user/create'
import { FindUserByOperator } from '@controller/operations/user/findBy'
import { FindAllUsersOperator } from '@controller/operations/user/findAll'
import { DeleteUserOperator } from '@controller/operations/user/delete'
import { UpdateUserOperator } from '@controller/operations/user/update'
import { CreateStudyGroupOperator } from '@controller/operations/studyGroup/create'
import { FindAllStudyGroupsOperator } from '@controller/operations/studyGroup/findAll'
import { FindByStudyGroupOperator } from '@controller/operations/studyGroup/findBy'
import { DeleteStudyGroupOperator } from '@controller/operations/studyGroup/delete'
import { CreatePostOperator } from '@controller/operations/post/create'
import { FindPostByOperator } from '@controller/operations/post/findBy'
import { FindAllPostsOperator } from '@controller/operations/post/findAll'
import { DeletePostOperator } from '@controller/operations/post/delete'
import { UpdatePostOperator } from '@controller/operations/post/update'
import { CreatePostReactionOperator } from '@controller/operations/postReaction/create'
import { DeletePostReactionOperator } from '@controller/operations/postReaction/delete'
import { FindAllPostReactionsOperator } from '@controller/operations/postReaction/findAll'

export const operatorModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CreateUserOperator).toSelf()
  bind(FindUserByOperator).toSelf()
  bind(FindAllUsersOperator).toSelf()
  bind(DeleteUserOperator).toSelf()
  bind(UpdateUserOperator).toSelf()

  bind(CreateStudyGroupOperator).toSelf()
  bind(FindAllStudyGroupsOperator).toSelf()
  bind(FindByStudyGroupOperator).toSelf()
  bind(DeleteStudyGroupOperator).toSelf()

  bind(CreatePostOperator).toSelf()
  bind(FindPostByOperator).toSelf()
  bind(FindAllPostsOperator).toSelf()
  bind(DeletePostOperator).toSelf()
  bind(UpdatePostOperator).toSelf()

  bind(CreatePostReactionOperator).toSelf()
  bind(DeletePostReactionOperator).toSelf()
  bind(FindAllPostReactionsOperator).toSelf()
})
