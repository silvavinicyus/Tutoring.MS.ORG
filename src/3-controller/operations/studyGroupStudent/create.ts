import { inject, injectable } from 'inversify'
import { InputCreateStudyGroupStudent } from '@controller/serializers/studyGroupStudent/create'
import { IOutputCreateStudyGroupStudentDto } from '@business/dto/studyGroupStudent/create'
import { CreateStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/createStudyGroupStudent'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { left } from '@shared/either'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { FindByStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/findByStudyGroupStudent'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
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
    private findByStudyGroupStudent: FindByStudyGroupStudentUseCase
  ) {
    super()
  }

  async run(
    input: InputCreateStudyGroupStudent
  ): Promise<IOutputCreateStudyGroupStudentDto> {
    this.exec(input)

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
