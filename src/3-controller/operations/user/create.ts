import { inject } from 'inversify'
import { IOutputCreateUserDto } from '@business/dto/user/create'
import { CreateUserUseCase } from '@business/useCases/user/createUser'
import { InputCreateUser } from '@controller/serializers/user/create'
import { left } from '@shared/either'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { UserErrors } from '@business/module/errors/userErrors'
import { CreateUserNotification } from '@business/useCases/notification/createUserNotification'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { AbstractOperator } from '../abstractOperator'

export class CreateUserOperator extends AbstractOperator<
  InputCreateUser,
  IOutputCreateUserDto
> {
  constructor(
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase,
    @inject(CreateUserUseCase)
    private createUser: CreateUserUseCase,
    @inject(FindByUserUseCase)
    private findByUser: FindByUserUseCase,
    @inject(CreateUserNotification)
    private createUserNotification: CreateUserNotification
  ) {
    super()
  }

  async run(input: InputCreateUser): Promise<IOutputCreateUserDto> {
    this.exec(input)
    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }

    const userExists = await this.findByUser.exec({
      where: [
        {
          column: 'email',
          value: input.email,
        },
      ],
    })

    if (userExists.isLeft() && userExists.value.statusCode !== 404) {
      return left(userExists.value)
    }

    if (userExists.isRight()) {
      return left(UserErrors.emailAlreadyInUse())
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

    const userNotification = await this.createUserNotification.exec({
      ...userResult.value,
      password: input.password,
    })

    if (userNotification.isLeft()) {
      await transaction.value.rollback()
      return left(userNotification.value)
    }

    await transaction.value.commit()
    return userResult
  }
}
