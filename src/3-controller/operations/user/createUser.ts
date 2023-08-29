import { inject } from 'inversify'
import { InputCreateUser } from '@controller/serializers/user/createUser'
import { IOutputCreateUserDto } from '@business/dto/user/createUserDto'
import { CreateUserUseCase } from '@business/useCases/user/createUser'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

export class CreateUserOperator extends AbstractOperator<
  InputCreateUser,
  IOutputCreateUserDto
> {
  constructor(
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase,
    @inject(CreateUserUseCase)
    private createUser: CreateUserUseCase
  ) {
    super()
  }
  async run(
    input: InputCreateUser,
    _authorizer: IAuthorizerInformation
  ): Promise<IOutputCreateUserDto> {
    this.exec(input)
    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }
    const userResult = await this.createUser.exec(
      {
        ...input,
      },
      transaction.value.trx
    )
    if (userResult.isLeft()) {
      await transaction.value.rollback()
      return left(userResult.value)
    }

    await transaction.value.commit()
    return userResult
  }
}
