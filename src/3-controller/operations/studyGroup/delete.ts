import { inject, injectable } from 'inversify'
import { IOutputDeleteStudyGroupDto } from '@business/dto/studyGroup/delete'
import { DeleteStudyGroupUseCase } from '@business/useCases/studyGroup/deleteStudyGroup'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { InputDeleteStudyGroup } from '@controller/serializers/studyGroup/delete'
import { left } from '@shared/either'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteStudyGroupOperator extends AbstractOperator<
  InputDeleteStudyGroup,
  IOutputDeleteStudyGroupDto
> {
  constructor(
    @inject(DeleteStudyGroupUseCase)
    private deleteStudyGroup: DeleteStudyGroupUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroup: FindStudyGroupByUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }
  async run(
    input: InputDeleteStudyGroup,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputDeleteStudyGroupDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['delete_study_group'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const studyGroup = await this.findStudyGroup.exec({
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

    const studyGroupResult = await this.deleteStudyGroup.exec({
      id: studyGroup.value.id,
    })

    if (studyGroupResult.isLeft()) {
      return left(studyGroupResult.value)
    }

    return studyGroupResult
  }
}
