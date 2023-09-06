import { inject, injectable } from 'inversify'
import { InputFindStudyGroupBy } from '@controller/serializers/studyGroup/findBy'
import { IOutputFindStudyGroupByDto } from '@business/dto/studyGroup/findBy'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindByStudyGroupOperator extends AbstractOperator<
  InputFindStudyGroupBy,
  IOutputFindStudyGroupByDto
> {
  constructor(
    @inject(FindStudyGroupByUseCase)
    private findStudyGroupBy: FindStudyGroupByUseCase
  ) {
    super()
  }

  async run(input: InputFindStudyGroupBy): Promise<IOutputFindStudyGroupByDto> {
    this.exec(input)

    const studyGroup = await this.findStudyGroupBy.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (studyGroup.isLeft()) {
      return left(studyGroup.value)
    }

    return studyGroup
  }
}
