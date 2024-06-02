import { inject, injectable } from 'inversify'
import { IOutputDeleteUserDto } from '@business/dto/user/delete'
import { InputDeleteUser } from '@controller/serializers/user/delete'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUser'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { left } from '@shared/either'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { CreateOrUpdateUserNotification } from '@business/useCases/notification/createOrUpdateUserNotification'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteUserOperator extends AbstractOperator<
  InputDeleteUser,
  IOutputDeleteUserDto
> {
  constructor(
    @inject(DeleteUserUseCase)
    private deleteUser: DeleteUserUseCase,
    @inject(FindByUserUseCase)
    private findUser: FindByUserUseCase,
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase,
    @inject(CreateOrUpdateUserNotification)
    private createOrUpdateUser: CreateOrUpdateUserNotification
  ) {
    super()
  }

  async run(input: InputDeleteUser): Promise<IOutputDeleteUserDto> {
    this.exec(input)

    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }

    const user = await this.findUser.exec({
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

    const userResult = await this.deleteUser.exec(
      {
        id: user.value.id,
      },
      transaction.value.trx
    )

    if (userResult.value) {
      await transaction.value.rollback()
      return left(userResult.value)
    }

    const deleteUserNotification = await this.createOrUpdateUser.exec({
      user: {
        id: user.value.id,
      },
      deleted: true,
    })

    if (deleteUserNotification.isLeft()) {
      await transaction.value.rollback()
      return left(deleteUserNotification.value)
    }

    await transaction.value.commit()
    return userResult
  }
}
