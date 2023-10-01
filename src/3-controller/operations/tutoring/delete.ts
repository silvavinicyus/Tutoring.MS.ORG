import { inject, injectable } from 'inversify'
import { InputDeleteTutoring } from '@controller/serializers/tutoring/delete'
import { IOutputDeleteTutoringDto } from '@business/dto/tutoring/delete'
import { DeleteTutoringUseCase } from '@business/useCases/tutoring/deleteTutoring'
import { FindByTutoringUseCase } from '@business/useCases/tutoring/findByTutoring'
import { left } from '@shared/either'
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
    private findByTutoring: FindByTutoringUseCase
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

    const tutoringResult = await this.deleteTutoring.exec({
      id: tutoring.value.id,
    })

    if (tutoringResult.isLeft()) {
      return left(tutoringResult.value)
    }

    return tutoringResult
  }
}
