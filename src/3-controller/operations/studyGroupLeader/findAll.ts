import { inject, injectable } from 'inversify'
import { IOutputFindAllStudyGroupLeadersDto } from '@business/dto/studyGroupLeader/findAll'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { FindAllStudyGroupLeadersUseCase } from '@business/useCases/studyGroupLeader/findAllStudyGroupLeaders'
import { InputFindAllStudyGroupLeaders } from '@controller/serializers/studyGroupLeader/findAll'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
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
    private findStudyGroupBy: FindStudyGroupByUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputFindAllStudyGroupLeaders,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputFindAllStudyGroupLeadersDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['view_study_group_leader'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

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
