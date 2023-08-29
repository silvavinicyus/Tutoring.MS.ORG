import { ContainerModule, interfaces } from 'inversify'
import { CreateUserOperator } from '@controller/operations/user/createUser'

export const operatorModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CreateUserOperator).toSelf()
})
