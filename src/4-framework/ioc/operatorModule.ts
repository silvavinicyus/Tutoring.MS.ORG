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
})
