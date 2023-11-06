import { inject, injectable } from 'inversify'
import { InputDeleteStudyGroupStudent } from '@controller/serializers/studyGroupStudent/delete'
import { IOutputDeleteStudyGroupStudentDto } from '@business/dto/studyGroupStudent/delete'
import { DeleteStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/deleteStudyGroupStudent'
import { FindByStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/findByStudyGroupStudent'
import { left } from '@shared/either'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteStudyGroupStudentOperator extends AbstractOperator<
  InputDeleteStudyGroupStudent,
  IOutputDeleteStudyGroupStudentDto
> {
  constructor(
    @inject(DeleteStudyGroupStudentUseCase)
    private deleteStudyGroupStudent: DeleteStudyGroupStudentUseCase,
    @inject(FindByStudyGroupStudentUseCase)
    private findByStudyGroupStudent: FindByStudyGroupStudentUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroup: FindStudyGroupByUseCase
  ) {
    super()
  }

  async run(
    input: InputDeleteStudyGroupStudent,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputDeleteStudyGroupStudentDto> {
    this.exec(input)

    const studyGroupStudent = await this.findByStudyGroupStudent.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (studyGroupStudent.isLeft()) {
      return left(studyGroupStudent.value)
    }

    const group = await this.findStudyGroup.exec({
      where: [
        {
          column: 'id',
          value: studyGroupStudent.value.group_id,
        },
      ],
      relations: [
        {
          tableName: 'leaders',
          currentTableColumn: '',
          foreignJoinColumn: '',
        },
      ],
    })

    if (group.isLeft()) {
      return left(group.value)
    }

    const isAuthorizerCreator =
      group.value.creator_id !== +authorizer.user_real_id
    const isAuthorizerLeader = group.value.leaders.find(
      (leader) => leader.id === +authorizer.user_real_id
    )

    if (!isAuthorizerCreator || !isAuthorizerLeader) {
      return left(RolesErrors.notAllowed())
    }

    const studyGroupStudentResult = await this.deleteStudyGroupStudent.exec({
      id: studyGroupStudent.value.id,
    })

    if (studyGroupStudentResult.isLeft()) {
      return left(studyGroupStudentResult.value)
    }

    return studyGroupStudentResult
  }
}
