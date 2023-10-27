import { inject, injectable } from 'inversify'
import { InputRequestToJoinStudyGroup } from '@controller/serializers/studyGroupStudent/requestToJoin'
import { IOutputCreateStudyGroupRequestDto } from '@business/dto/studyGroupRequest/create'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { CreateStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/createStudyGroupRequest'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { StudyGroupRequestErrors } from '@business/module/errors/studyGroupRequestErrors'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class RequestToJoinStudyGroupOperator extends AbstractOperator<
  InputRequestToJoinStudyGroup,
  IOutputCreateStudyGroupRequestDto
> {
  constructor(
    @inject(FindByUserUseCase)
    private findByUser: FindByUserUseCase,
    @inject(FindStudyGroupByUseCase)
    private findByStudyGroup: FindStudyGroupByUseCase,
    @inject(CreateStudyGroupRequestUseCase)
    private createStudyGroupRequest: CreateStudyGroupRequestUseCase
  ) {
    super()
  }

  async run(
    input: InputRequestToJoinStudyGroup,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputCreateStudyGroupRequestDto> {
    this.exec(input)

    const requester = await this.findByUser.exec({
      where: [
        {
          column: 'id',
          value: authorizer.user_real_id,
        },
      ],
    })

    if (requester.isLeft()) {
      return left(requester.value)
    }

    const studyGroup = await this.findByStudyGroup.exec({
      where: [
        {
          column: 'uuid',
          value: input.group_uuid,
        },
      ],
      relations: [
        {
          tableName: 'students',
          currentTableColumn: '',
          foreignJoinColumn: '',
        },
      ],
    })

    if (studyGroup.isLeft()) {
      return left(studyGroup.value)
    }

    const isRequesterAlreadyInGroup = studyGroup.value.students.find(
      (student) => +student.id === +authorizer.user_real_id
    )

    if (isRequesterAlreadyInGroup) {
      return left(StudyGroupRequestErrors.alreadyInGroup())
    }

    const groupRequest = await this.createStudyGroupRequest.exec({
      group_id: studyGroup.value.id,
      requester_id: requester.value.id,
    })

    if (groupRequest.isLeft()) {
      return left(groupRequest.value)
    }

    return groupRequest
  }
}
