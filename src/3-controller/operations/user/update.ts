import { inject, injectable } from 'inversify'
import { IOutputUpdateUserDto } from '@business/dto/user/update'
import { CreateOrUpdateUserNotification } from '@business/useCases/notification/createOrUpdateUserNotification'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { UpdateUserUseCase } from '@business/useCases/user/updateUser'
import { InputUpdateUser } from '@controller/serializers/user/update'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateUserOperator extends AbstractOperator<
  InputUpdateUser,
  IOutputUpdateUserDto
> {
  constructor(
    @inject(UpdateUserUseCase)
    private updateUser: UpdateUserUseCase,
    @inject(FindByUserUseCase)
    private findUserBy: FindByUserUseCase,
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase,
    @inject(CreateOrUpdateUserNotification)
    private createOrUpdateUser: CreateOrUpdateUserNotification
  ) {
    super()
  }

  async run(input: InputUpdateUser): Promise<IOutputUpdateUserDto> {
    this.exec(input)

    const transaction = await this.createTransaction.exec()

    if (transaction.isLeft()) {
      return left(transaction.value)
    }

    const user = await this.findUserBy.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (user.isLeft()) {
      await transaction.value.rollback()
      return left(user.value)
    }

    const userResult = await this.updateUser.exec(
      {
        ...input,
      },
      {
        column: 'uuid',
        value: input.uuid,
      },
      transaction.value.trx
    )

    if (userResult.isLeft()) {
      await transaction.value.rollback()
      return left(userResult.value)
    }

    const updateNotification = await this.createOrUpdateUser.exec({
      user: {
        ...input,
        uuid: input.uuid,
        id: userResult.value.id,
      },
    })

    if (updateNotification.isLeft()) {
      await transaction.value.rollback()
      return left(updateNotification.value)
    }

    await transaction.value.commit()
    return userResult
  }
}
