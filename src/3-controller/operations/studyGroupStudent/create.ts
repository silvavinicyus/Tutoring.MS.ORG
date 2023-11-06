import { inject, injectable } from 'inversify'
import { IOutputCreateStudyGroupStudentDto } from '@business/dto/studyGroupStudent/create'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { CreateStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/createStudyGroupStudent'
import { FindByStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/findByStudyGroupStudent'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { InputCreateStudyGroupStudent } from '@controller/serializers/studyGroupStudent/create'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateStudyGroupStudentOperator extends AbstractOperator<
  InputCreateStudyGroupStudent,
  IOutputCreateStudyGroupStudentDto
> {
  constructor(
    @inject(CreateStudyGroupStudentUseCase)
    private createStudyGroupStudent: CreateStudyGroupStudentUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroupBy: FindStudyGroupByUseCase,
    @inject(FindByUserUseCase)
    private findByUser: FindByUserUseCase,
    @inject(FindByStudyGroupStudentUseCase)
    private findByStudyGroupStudent: FindByStudyGroupStudentUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputCreateStudyGroupStudent,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputCreateStudyGroupStudentDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['create_study_group_student'],
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
      relations: [
        {
          tableName: 'leaders',
          currentTableColumn: '',
          foreignJoinColumn: '',
        },
      ],
    })

    if (studyGroup.isLeft()) {
      return left(studyGroup.value)
    }

    const isAuthorizerCreator =
      studyGroup.value.creator_id !== +authorizer.user_real_id
    const isAuthorizerLeader = studyGroup.value.leaders.find(
      (leader) => leader.id === +authorizer.user_real_id
    )

    if (!isAuthorizerCreator || !isAuthorizerLeader) {
      return left(RolesErrors.notAllowed())
    }

    const student = await this.findByUser.exec({
      where: [
        {
          column: 'uuid',
          value: input.student_uuid,
        },
      ],
    })

    if (student.isLeft()) {
      return left(student.value)
    }

    const studyGroupStudent = await this.findByStudyGroupStudent.exec({
      where: [
        {
          column: 'group_id',
          value: studyGroup.value.id,
        },
        {
          column: 'student_id',
          value: student.value.id,
        },
      ],
    })

    if (
      studyGroupStudent.isLeft() &&
      studyGroupStudent.value.statusCode !== 404
    ) {
      return left(studyGroupStudent.value)
    }

    if (studyGroupStudent.isRight()) {
      return left(StudyGroupStudentErrors.alreadyExists())
    }

    const studyGroupStudentResult = await this.createStudyGroupStudent.exec({
      group_id: studyGroup.value.id,
      student_id: student.value.id,
    })

    if (studyGroupStudentResult.isLeft()) {
      return left(studyGroupStudentResult.value)
    }

    return studyGroupStudentResult
  }
}
