import { ContainerModule, interfaces } from 'inversify'
import { CreateUserUseCase } from '@business/useCases/user/createUser'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'

export const useCaseModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(VerifyProfileUseCase).toSelf()

  bind(CreateTransactionUseCase).toSelf()

  bind(CreateUserUseCase).toSelf()
})
