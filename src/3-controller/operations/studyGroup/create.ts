import { inject, injectable } from 'inversify'
import { IOutputCreateStudyGroupDto } from '@business/dto/studyGroup/create'
import { CreateStudyGroupUseCase } from '@business/useCases/studyGroup/createStudyGroup'
import { InputCreateStudyGroup } from '@controller/serializers/studyGroup/create'
import { left } from '@shared/either'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateStudyGroupOperator extends AbstractOperator<
  InputCreateStudyGroup,
  IOutputCreateStudyGroupDto
> {
  constructor(
    @inject(CreateStudyGroupUseCase)
    private createStudyGroup: CreateStudyGroupUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputCreateStudyGroup,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputCreateStudyGroupDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['create_study_group'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const studyGroupResult = await this.createStudyGroup.exec({ ...input })
    if (studyGroupResult.isLeft()) {
      return left(studyGroupResult.value)
    }

    return studyGroupResult
  }
}
