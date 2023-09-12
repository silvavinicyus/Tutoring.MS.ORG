import { inject, injectable } from 'inversify'
import { IOutputFindAllStudyGroupLeadersDto } from '@business/dto/studyGroupLeader/findAll'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { FindAllStudyGroupLeadersUseCase } from '@business/useCases/studyGroupLeader/findAllStudyGroupLeaders'
import { InputFindAllStudyGroupLeaders } from '@controller/serializers/studyGroupLeader/findAll'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllStudyGroupLeadersOperator extends AbstractOperator<
  InputFindAllStudyGroupLeaders,
  IOutputFindAllStudyGroupLeadersDto
> {
  constructor(
    @inject(FindAllStudyGroupLeadersUseCase)
    private findAllStudyGroupLeaders: FindAllStudyGroupLeadersUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroupBy: FindStudyGroupByUseCase
  ) {
    super()
  }

  async run(
    input: InputFindAllStudyGroupLeaders
  ): Promise<IOutputFindAllStudyGroupLeadersDto> {
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

    const studyGroupLeaders = await this.findAllStudyGroupLeaders.exec({
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

    if (studyGroupLeaders.isLeft()) {
      return left(studyGroupLeaders.value)
    }

    return studyGroupLeaders
  }
}
