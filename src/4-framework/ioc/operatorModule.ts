import { ContainerModule, interfaces } from 'inversify'
import { CreatePostOperator } from '@controller/operations/post/create'
import { DeletePostOperator } from '@controller/operations/post/delete'
import { FindAllPostsOperator } from '@controller/operations/post/findAll'
import { FindPostByOperator } from '@controller/operations/post/findBy'
import { UpdatePostOperator } from '@controller/operations/post/update'
import { CreatePostReactionOperator } from '@controller/operations/postReaction/create'
import { DeletePostReactionOperator } from '@controller/operations/postReaction/delete'
import { FindAllPostReactionsOperator } from '@controller/operations/postReaction/findAll'
import { CreateStudyGroupOperator } from '@controller/operations/studyGroup/create'
import { DeleteStudyGroupOperator } from '@controller/operations/studyGroup/delete'
import { FindAllStudyGroupsOperator } from '@controller/operations/studyGroup/findAll'
import { FindByStudyGroupOperator } from '@controller/operations/studyGroup/findBy'
import { CreateStudyGroupLeaderOperator } from '@controller/operations/studyGroupLeader/create'
import { DeleteStudyGroupLeaderOperator } from '@controller/operations/studyGroupLeader/delete'
import { FindAllStudyGroupLeadersOperator } from '@controller/operations/studyGroupLeader/findAll'
import { AnswerRequestToJoinStudyGroupOperator } from '@controller/operations/studyGroupStudent/answerRequestToJoin'
import { CreateStudyGroupStudentOperator } from '@controller/operations/studyGroupStudent/create'
import { DeleteStudyGroupStudentOperator } from '@controller/operations/studyGroupStudent/delete'
import { FindAllStudyGroupStudentsOperator } from '@controller/operations/studyGroupStudent/findAll'
import { RequestToJoinStudyGroupOperator } from '@controller/operations/studyGroupStudent/requestToJoin'
import { CreateTutoringOperator } from '@controller/operations/tutoring/create'
import { DeleteTutoringOperator } from '@controller/operations/tutoring/delete'
import { FindAllTutoringsOperator } from '@controller/operations/tutoring/findAll'
import { FindTutoringByOperator } from '@controller/operations/tutoring/findBy'
import { UpdateTutoringOperator } from '@controller/operations/tutoring/update'
import { CreateUserOperator } from '@controller/operations/user/create'
import { DeleteUserOperator } from '@controller/operations/user/delete'
import { FindAllUsersOperator } from '@controller/operations/user/findAll'
import { FindUserByOperator } from '@controller/operations/user/findBy'
import { UpdateUserOperator } from '@controller/operations/user/update'

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

  bind(CreateStudyGroupLeaderOperator).toSelf()
  bind(DeleteStudyGroupLeaderOperator).toSelf()
  bind(FindAllStudyGroupLeadersOperator).toSelf()

  bind(CreateStudyGroupStudentOperator).toSelf()
  bind(DeleteStudyGroupStudentOperator).toSelf()
  bind(FindAllStudyGroupStudentsOperator).toSelf()
  bind(RequestToJoinStudyGroupOperator).toSelf()
  bind(AnswerRequestToJoinStudyGroupOperator).toSelf()

  bind(CreateTutoringOperator).toSelf()
  bind(FindAllTutoringsOperator).toSelf()
  bind(FindTutoringByOperator).toSelf()
  bind(UpdateTutoringOperator).toSelf()
  bind(DeleteTutoringOperator).toSelf()
})
