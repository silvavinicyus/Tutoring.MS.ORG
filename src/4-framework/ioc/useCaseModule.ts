import { ContainerModule, interfaces } from 'inversify'
import { CreateUserUseCase } from '@business/useCases/user/createUser'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsers'
import { UpdateUserUseCase } from '@business/useCases/user/updateUser'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUser'

export const useCaseModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(VerifyProfileUseCase).toSelf()

  bind(CreateTransactionUseCase).toSelf()

  bind(CreateUserUseCase).toSelf()
  bind(FindByUserUseCase).toSelf()
  bind(FindAllUsersUseCase).toSelf()
  bind(UpdateUserUseCase).toSelf()
  bind(DeleteUserUseCase).toSelf()
})
