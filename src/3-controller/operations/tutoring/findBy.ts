import { inject, injectable } from 'inversify'
import { InputFindByTutoring } from '@controller/serializers/tutoring/findBy'
import { IOutputFindByTutoringDto } from '@business/dto/tutoring/findBy'
import { FindByTutoringUseCase } from '@business/useCases/tutoring/findByTutoring'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindTutoringByOperator extends AbstractOperator<
  InputFindByTutoring,
  IOutputFindByTutoringDto
> {
  constructor(
    @inject(FindByTutoringUseCase)
    private findByTutoring: FindByTutoringUseCase
  ) {
    super()
  }

  async run(input: InputFindByTutoring): Promise<IOutputFindByTutoringDto> {
    this.exec(input)

    const tutoring = await this.findByTutoring.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
      relations: [
        {
          tableName: 'tutor',
          currentTableColumn: 'tutor_id',
          foreignJoinColumn: 'id',
        },
        {
          tableName: 'student',
          currentTableColumn: 'student_id',
          foreignJoinColumn: 'id',
        },
      ],
    })

    if (tutoring.isLeft()) {
      return left(tutoring.value)
    }

    return tutoring
  }
}
