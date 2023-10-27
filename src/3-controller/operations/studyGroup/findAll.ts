import { inject, injectable } from 'inversify'
import { InputFindAllStudyGroups } from '@controller/serializers/studyGroup/findAll'
import { IOutputFindAllStudyGroupsDto } from '@business/dto/studyGroup/findAll'
import { FindAllStudyGroupsUseCase } from '@business/useCases/studyGroup/findAllStudyGroups'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllStudyGroupsOperator extends AbstractOperator<
  InputFindAllStudyGroups,
  IOutputFindAllStudyGroupsDto
> {
  constructor(
    @inject(FindAllStudyGroupsUseCase)
    private findAllStudyGroups: FindAllStudyGroupsUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputFindAllStudyGroups,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputFindAllStudyGroupsDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['view_study_group'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

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
        {
          tableName: 'leaders',
          currentTableColumn: '',
          foreignJoinColumn: '',
        },
        {
          tableName: 'students',
          currentTableColumn: '',
          foreignJoinColumn: '',
        },
      ],
    })

    if (studyGroups.isLeft()) {
      return left(studyGroups.value)
    }

    return studyGroups
  }
}
