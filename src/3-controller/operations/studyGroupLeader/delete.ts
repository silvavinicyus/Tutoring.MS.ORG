import { inject, injectable } from 'inversify'
import { InputDeleteStudyGroupLeader } from '@controller/serializers/studyGroupLeader/delete'
import { IOutputDeleteStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/delete'
import { DeleteStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/deleteStudyGroupLeader'
import { FindByStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/findByStudyGroupLeader'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteStudyGroupLeaderOperator extends AbstractOperator<
  InputDeleteStudyGroupLeader,
  IOutputDeleteStudyGroupLeaderDto
> {
  constructor(
    @inject(DeleteStudyGroupLeaderUseCase)
    private deleteStudyGroupLeader: DeleteStudyGroupLeaderUseCase,
    @inject(FindByStudyGroupLeaderUseCase)
    private findByStudyGroupLeader: FindByStudyGroupLeaderUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroup: FindStudyGroupByUseCase
  ) {
    super()
  }

  async run(
    input: InputDeleteStudyGroupLeader,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputDeleteStudyGroupLeaderDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['delete_study_group_leader'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const studyGroupLeader = await this.findByStudyGroupLeader.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (studyGroupLeader.isLeft()) {
      return left(studyGroupLeader.value)
    }

    const group = await this.findStudyGroup.exec({
      where: [
        {
          column: 'id',
          value: studyGroupLeader.value.group_id,
        },
      ],
    })

    if (group.isLeft()) {
      return left(group.value)
    }

    const isAuthorizerCreator =
      group.value.creator_id === +authorizer.user_real_id

    if (!isAuthorizerCreator) {
      return left(RolesErrors.notAllowed())
    }

    const studyGroupLeaderResult = await this.deleteStudyGroupLeader.exec({
      id: studyGroupLeader.value.id,
    })

    if (studyGroupLeaderResult.isLeft()) {
      return left(studyGroupLeaderResult.value)
    }

    return studyGroupLeaderResult
  }
}
