import { ContainerModule, interfaces } from 'inversify'
import { CreateUserOperator } from '@controller/operations/user/create'
import { FindUserByOperator } from '@controller/operations/user/findBy'
import { FindAllUsersOperator } from '@controller/operations/user/findAll'
import { DeleteUserOperator } from '@controller/operations/user/delete'
import { UpdateUserOperator } from '@controller/operations/user/update'

export const operatorModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CreateUserOperator).toSelf()
  bind(FindUserByOperator).toSelf()
  bind(FindAllUsersOperator).toSelf()
  bind(DeleteUserOperator).toSelf()
  bind(UpdateUserOperator).toSelf()
})
