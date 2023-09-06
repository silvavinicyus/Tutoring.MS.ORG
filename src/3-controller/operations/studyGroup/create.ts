import { inject, injectable } from 'inversify'
import { IOutputCreateStudyGroupDto } from '@business/dto/studyGroup/create'
import { CreateStudyGroupUseCase } from '@business/useCases/studyGroup/createStudyGroup'
import { InputCreateStudyGroup } from '@controller/serializers/studyGroup/create'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateStudyGroupOperator extends AbstractOperator<
  InputCreateStudyGroup,
  IOutputCreateStudyGroupDto
> {
  constructor(
    @inject(CreateStudyGroupUseCase)
    private createStudyGroup: CreateStudyGroupUseCase
  ) {
    super()
  }

  async run(input: InputCreateStudyGroup): Promise<IOutputCreateStudyGroupDto> {
    this.exec(input)

    const studyGroupResult = await this.createStudyGroup.exec({ ...input })
    if (studyGroupResult.isLeft()) {
      return left(studyGroupResult.value)
    }

    return studyGroupResult
  }
}
