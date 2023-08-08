import { CreateFooOperator } from '@controller/operations/foo/createFoo'
import { ContainerModule, interfaces } from 'inversify'

export const operatorModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CreateFooOperator).toSelf()
})
