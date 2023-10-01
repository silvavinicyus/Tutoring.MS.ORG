import { inject, injectable } from 'inversify'
import { IOutputUpdateTutoringDto } from '@business/dto/tutoring/update'
import { FindByTutoringUseCase } from '@business/useCases/tutoring/findByTutoring'
import { UpdateTutoringUseCase } from '@business/useCases/tutoring/updateTutoring'
import { InputUpdateTutoring } from '@controller/serializers/tutoring/update'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateTutoringOperator extends AbstractOperator<
  InputUpdateTutoring,
  IOutputUpdateTutoringDto
> {
  constructor(
    @inject(FindByTutoringUseCase)
    private findByTutoring: FindByTutoringUseCase,
    @inject(UpdateTutoringUseCase)
    private updateTutoring: UpdateTutoringUseCase
  ) {
    super()
  }

  async run(input: InputUpdateTutoring): Promise<IOutputUpdateTutoringDto> {
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

    const tutoringResult = await this.updateTutoring.exec(
      {
        date: input.date,
      },
      {
        column: 'uuid',
        value: input.uuid,
      }
    )

    if (tutoringResult.isLeft()) {
      return left(tutoringResult.value)
    }

    return tutoringResult
  }
}
