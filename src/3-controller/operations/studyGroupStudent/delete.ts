import { inject, injectable } from 'inversify'
import { InputDeleteStudyGroupStudent } from '@controller/serializers/studyGroupStudent/delete'
import { IOutputDeleteStudyGroupStudentDto } from '@business/dto/studyGroupStudent/delete'
import { DeleteStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/deleteStudyGroupStudent'
import { FindByStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/findByStudyGroupStudent'
import { left } from '@shared/either'
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
    private findByStudyGroupStudent: FindByStudyGroupStudentUseCase
  ) {
    super()
  }

  async run(
    input: InputDeleteStudyGroupStudent
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

    const studyGroupStudentResult = await this.deleteStudyGroupStudent.exec({
      id: studyGroupStudent.value.id,
    })

    if (studyGroupStudentResult.isLeft()) {
      return left(studyGroupStudentResult.value)
    }

    return studyGroupStudentResult
  }
}
