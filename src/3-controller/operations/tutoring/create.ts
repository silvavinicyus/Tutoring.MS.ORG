import { inject, injectable } from 'inversify'
import { InputCreateTutoring } from '@controller/serializers/tutoring/create'
import { IOutputCreateTutoringDto } from '@business/dto/tutoring/create'
import { CreateTutoringUseCase } from '@business/useCases/tutoring/createTutoring'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { left } from '@shared/either'
import { CreateOrUpdateTutoringNotificationUseCase } from '@business/useCases/notification/createOrUpdateTutoringNotification'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateTutoringOperator extends AbstractOperator<
  InputCreateTutoring,
  IOutputCreateTutoringDto
> {
  constructor(
    @inject(CreateTutoringUseCase)
    private createTutoring: CreateTutoringUseCase,
    @inject(FindByUserUseCase)
    private findByUser: FindByUserUseCase,
    @inject(CreateOrUpdateTutoringNotificationUseCase)
    private createOrUpdateTutoringNotification: CreateOrUpdateTutoringNotificationUseCase,
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase
  ) {
    super()
  }

  async run(input: InputCreateTutoring): Promise<IOutputCreateTutoringDto> {
    this.exec(input)

    const tutor = await this.findByUser.exec({
      where: [
        {
          column: 'uuid',
          value: input.tutor_uuid,
        },
      ],
    })

    if (tutor.isLeft()) {
      return left(tutor.value)
    }

    const student = await this.findByUser.exec({
      where: [
        {
          column: 'uuid',
          value: input.student_uuid,
        },
      ],
    })

    if (student.isLeft()) {
      return left(student.value)
    }

    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }

    const tutoring = await this.createTutoring.exec(
      {
        ...input,
        student_id: student.value.id,
        tutor_id: tutor.value.id,
      },
      transaction.value.trx
    )

    if (tutoring.isLeft()) {
      await transaction.value.rollback()
      return left(tutoring.value)
    }

    const notification = await this.createOrUpdateTutoringNotification.exec({
      tutoring: {
        date: tutoring.value.date,
        subject: tutoring.value.subject,
        student_real_id: tutoring.value.student_id,
        tutor_real_id: tutoring.value.tutor_id,
        tutoring_real_id: tutoring.value.id,
        tutoring_real_uuid: tutoring.value.uuid,
      },
    })

    if (notification.isLeft()) {
      await transaction.value.rollback()
      return left(notification.value)
    }

    await transaction.value.commit()
    return tutoring
  }
}
