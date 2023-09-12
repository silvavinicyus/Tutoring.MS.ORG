import { inject, injectable } from 'inversify'
import {
  IInputFindAllStudyGroupStudentsDto,
  IOutputFindAllStudyGroupStudentsDto,
} from '@business/dto/studyGroupStudent/findAll'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IStudyGroupStudentRepository,
  IStudyGroupStudentRepositoryToken,
} from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { left, right } from '@shared/either'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllStudyGroupStudentsUseCase
  implements
    IAbstractUseCase<
      IInputFindAllStudyGroupStudentsDto,
      IOutputFindAllStudyGroupStudentsDto
    >
{
  constructor(
    @inject(IStudyGroupStudentRepositoryToken)
    private studyGroupStudentRepository: IStudyGroupStudentRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindAllStudyGroupStudentsDto
  ): Promise<IOutputFindAllStudyGroupStudentsDto> {
    try {
      const studyGroupStudents = await this.studyGroupStudentRepository.findAll(
        props
      )

      return right(studyGroupStudents)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupStudentErrors.loadFailed())
    }
  }
}
