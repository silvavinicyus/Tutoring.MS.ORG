import { inject, injectable } from 'inversify'
import { InputCreateTutoring } from '@controller/serializers/tutoring/create'
import { IOutputCreateTutoringDto } from '@business/dto/tutoring/create'
import { CreateTutoringUseCase } from '@business/useCases/tutoring/createTutoring'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { left } from '@shared/either'
import { CreateOrUpdateTutoringNotificatoinUseCase } from '@business/useCases/notification/createOrUpdateTutoringNotification'
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
    @inject(CreateOrUpdateTutoringNotificatoinUseCase)
    private createOrUpdateTutoringNotification: CreateOrUpdateTutoringNotificatoinUseCase
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

    const tutoring = await this.createTutoring.exec({
      ...input,
      student_id: student.value.id,
      tutor_id: tutor.value.id,
    })

    if (tutoring.isLeft()) {
      return left(tutoring.value)
    }

    const notification = await this.createOrUpdateTutoringNotification.exec({
      date: tutoring.value.date,
      subject: tutoring.value.subject,
      student_real_id: tutoring.value.student_id,
      tutor_real_id: tutoring.value.tutor_id,
      tutoring_real_id: tutoring.value.id,
      tutoring_real_uuid: tutoring.value.uuid,
    })

    if (notification.isLeft()) {
      return left(notification.value)
    }

    return tutoring
  }
}
