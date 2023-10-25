import { inject, injectable } from 'inversify'
import { InputCreateStudyGroupLeader } from '@controller/serializers/studyGroupLeader/create'
import { IOutputCreateStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/create'
import { CreateStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/createStudyGroupLeader'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { left } from '@shared/either'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { FindByStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/findByStudyGroupLeader'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateStudyGroupLeaderOperator extends AbstractOperator<
  InputCreateStudyGroupLeader,
  IOutputCreateStudyGroupLeaderDto
> {
  constructor(
    @inject(CreateStudyGroupLeaderUseCase)
    private createStudyGroupLeader: CreateStudyGroupLeaderUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroupBy: FindStudyGroupByUseCase,
    @inject(FindByUserUseCase)
    private findByUser: FindByUserUseCase,
    @inject(FindByStudyGroupLeaderUseCase)
    private findByStudyGroupLeader: FindByStudyGroupLeaderUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputCreateStudyGroupLeader,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputCreateStudyGroupLeaderDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['create_study_group_leader'],
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

    const leader = await this.findByUser.exec({
      where: [
        {
          column: 'uuid',
          value: input.leader_uuid,
        },
      ],
    })

    if (leader.isLeft()) {
      return left(leader.value)
    }

    const studyGroupLeader = await this.findByStudyGroupLeader.exec({
      where: [
        {
          column: 'group_id',
          value: studyGroup.value.id,
        },
        {
          column: 'leader_id',
          value: leader.value.id,
        },
      ],
    })

    if (
      studyGroupLeader.isLeft() &&
      studyGroupLeader.value.statusCode !== 404
    ) {
      return left(studyGroupLeader.value)
    }

    if (studyGroupLeader.isRight()) {
      return left(StudyGroupLeaderErrors.alreadyExists())
    }

    const studyGroupLeaderResult = await this.createStudyGroupLeader.exec({
      group_id: studyGroup.value.id,
      leader_id: leader.value.id,
    })

    if (studyGroupLeaderResult.isLeft()) {
      return left(studyGroupLeaderResult.value)
    }

    return studyGroupLeaderResult
  }
}
