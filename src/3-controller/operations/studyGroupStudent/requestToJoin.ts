import { inject, injectable } from 'inversify'
import { InputRequestToJoinStudyGroup } from '@controller/serializers/studyGroupStudent/requestToJoin'
import { IOutputCreateStudyGroupRequestDto } from '@business/dto/studyGroupRequest/create'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { CreateStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/createStudyGroupRequest'
import { left } from '@shared/either'
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
    input: InputRequestToJoinStudyGroup
  ): Promise<IOutputCreateStudyGroupRequestDto> {
    this.exec(input)

    const requester = await this.findByUser.exec({
      where: [
        {
          column: 'uuid',
          value: input.requester_uuid,
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
    })

    if (studyGroup.isLeft()) {
      return left(studyGroup.value)
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
