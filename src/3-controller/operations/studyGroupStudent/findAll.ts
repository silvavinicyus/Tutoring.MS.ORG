import { inject, injectable } from 'inversify'
import { FindAllStudyGroupStudentsUseCase } from '@business/useCases/studyGroupStudent/findAllStudyGroupStudent'
import { IOutputFindAllStudyGroupStudentsDto } from '@business/dto/studyGroupStudent/findAll'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { InputFindAllStudyGroupStudents } from '@controller/serializers/studyGroupStudent/findAll'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllStudyGroupStudentsOperator extends AbstractOperator<
  InputFindAllStudyGroupStudents,
  IOutputFindAllStudyGroupStudentsDto
> {
  constructor(
    @inject(FindAllStudyGroupStudentsUseCase)
    private findAllStudyGroupStudents: FindAllStudyGroupStudentsUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroupBy: FindStudyGroupByUseCase
  ) {
    super()
  }

  async run(
    input: InputFindAllStudyGroupStudents
  ): Promise<IOutputFindAllStudyGroupStudentsDto> {
    this.exec(input)

    const studyGroup = await this.findStudyGroupBy.exec({
      where: [
        {
          column: 'uuid',
          value: input.group_uuid,
        },
      ],
    })

    if (studyGroup.isLeft()) {
      return left(studyGroup.value)
    }

    const studyGroupStudents = await this.findAllStudyGroupStudents.exec({
      pagination: { count: input.count, page: input.page },
      filters: {
        contains: [
          ...input.contains,
          {
            column: 'group_id',
            value: studyGroup.value.id,
          },
        ],
      },
    })

    if (studyGroupStudents.isLeft()) {
      return left(studyGroupStudents.value)
    }

    return studyGroupStudents
  }
}
