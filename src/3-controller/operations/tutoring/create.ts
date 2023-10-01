import { inject, injectable } from 'inversify'
import { InputCreateTutoring } from '@controller/serializers/tutoring/create'
import { IOutputCreateTutoringDto } from '@business/dto/tutoring/create'
import { CreateTutoringUseCase } from '@business/useCases/tutoring/createTutoring'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { left } from '@shared/either'
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
    private findByUser: FindByUserUseCase
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

    return tutoring
  }
}
