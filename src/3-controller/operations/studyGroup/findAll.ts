import { inject, injectable } from 'inversify'
import { InputFindAllStudyGroups } from '@controller/serializers/studyGroup/findAll'
import { IOutputFindAllStudyGroupsDto } from '@business/dto/studyGroup/findAll'
import { FindAllStudyGroupsUseCase } from '@business/useCases/studyGroup/findAllStudyGroups'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllStudyGroupsOperator extends AbstractOperator<
  InputFindAllStudyGroups,
  IOutputFindAllStudyGroupsDto
> {
  constructor(
    @inject(FindAllStudyGroupsUseCase)
    private findAllStudyGroups: FindAllStudyGroupsUseCase
  ) {
    super()
  }

  async run(
    input: InputFindAllStudyGroups
  ): Promise<IOutputFindAllStudyGroupsDto> {
    this.exec(input)

    const studyGroups = await this.findAllStudyGroups.exec({
      pagination: { count: input.count, page: input.page },
      filters: {
        contains: input.contains,
      },
      relations: [
        {
          tableName: 'creator',
          currentTableColumn: 'creator_id',
          foreignJoinColumn: 'id',
        },
      ],
    })

    if (studyGroups.isLeft()) {
      return left(studyGroups.value)
    }

    return studyGroups
  }
}
