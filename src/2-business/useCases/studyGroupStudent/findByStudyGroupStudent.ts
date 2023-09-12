import { inject, injectable } from 'inversify'
import {
  IInputFindByStudyGroupStudentDto,
  IOutputFindByStudyGroupStudentDto,
} from '@business/dto/studyGroupStudent/findBy'
import {
  IStudyGroupStudentRepository,
  IStudyGroupStudentRepositoryToken,
} from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindByStudyGroupStudentUseCase
  implements
    IAbstractUseCase<
      IInputFindByStudyGroupStudentDto,
      IOutputFindByStudyGroupStudentDto
    >
{
  constructor(
    @inject(IStudyGroupStudentRepositoryToken)
    private studyGroupStudentRepository: IStudyGroupStudentRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindByStudyGroupStudentDto
  ): Promise<IOutputFindByStudyGroupStudentDto> {
    try {
      const studyGroupStudent = await this.studyGroupStudentRepository.findBy(
        props
      )

      if (!studyGroupStudent) {
        return left(StudyGroupStudentErrors.notFound())
      }

      return right(studyGroupStudent)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupStudentErrors.loadFailed())
    }
  }
}
