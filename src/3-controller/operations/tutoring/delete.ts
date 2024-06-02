import { inject, injectable } from 'inversify'
import { InputDeleteTutoring } from '@controller/serializers/tutoring/delete'
import { IOutputDeleteTutoringDto } from '@business/dto/tutoring/delete'
import { DeleteTutoringUseCase } from '@business/useCases/tutoring/deleteTutoring'
import { FindByTutoringUseCase } from '@business/useCases/tutoring/findByTutoring'
import { left } from '@shared/either'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { CreateOrUpdateTutoringNotificationUseCase } from '@business/useCases/notification/createOrUpdateTutoringNotification'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteTutoringOperator extends AbstractOperator<
  InputDeleteTutoring,
  IOutputDeleteTutoringDto
> {
  constructor(
    @inject(DeleteTutoringUseCase)
    private deleteTutoring: DeleteTutoringUseCase,
    @inject(FindByTutoringUseCase)
    private findByTutoring: FindByTutoringUseCase,
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase,
    @inject(CreateOrUpdateTutoringNotificationUseCase)
    private createOrUpdateTutoring: CreateOrUpdateTutoringNotificationUseCase
  ) {
    super()
  }

  async run(input: InputDeleteTutoring): Promise<IOutputDeleteTutoringDto> {
    this.exec(input)

    const tutoring = await this.findByTutoring.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (tutoring.isLeft()) {
      return left(tutoring.value)
    }

    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }

    const tutoringResult = await this.deleteTutoring.exec(
      {
        id: tutoring.value.id,
      },
      transaction.value.trx
    )

    if (tutoringResult.isLeft()) {
      await transaction.value.rollback()
      return left(tutoringResult.value)
    }

    const deleteTutoringNotification = await this.createOrUpdateTutoring.exec({
      tutoring: {
        tutoring_real_id: tutoring.value.id,
      },
      deleted: true,
    })

    if (deleteTutoringNotification.isLeft()) {
      await transaction.value.rollback()
      return left(deleteTutoringNotification.value)
    }

    await transaction.value.commit()
    return tutoringResult
  }
}
