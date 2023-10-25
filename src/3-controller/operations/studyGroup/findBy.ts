import { inject, injectable } from 'inversify'
import { InputFindStudyGroupBy } from '@controller/serializers/studyGroup/findBy'
import { IOutputFindStudyGroupByDto } from '@business/dto/studyGroup/findBy'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindByStudyGroupOperator extends AbstractOperator<
  InputFindStudyGroupBy,
  IOutputFindStudyGroupByDto
> {
  constructor(
    @inject(FindStudyGroupByUseCase)
    private findStudyGroupBy: FindStudyGroupByUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputFindStudyGroupBy,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputFindStudyGroupByDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['view_study_group'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const studyGroup = await this.findStudyGroupBy.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
      relations: [
        {
          tableName: 'creator',
          currentTableColumn: 'creator_id',
          foreignJoinColumn: 'id',
        },
      ],
    })

    if (studyGroup.isLeft()) {
      return left(studyGroup.value)
    }

    return studyGroup
  }
}
