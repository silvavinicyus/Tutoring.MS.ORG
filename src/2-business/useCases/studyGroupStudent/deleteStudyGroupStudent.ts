import { inject, injectable } from 'inversify'
import {
  IInputDeleteStudyGroupStudentDto,
  IOutputDeleteStudyGroupStudentDto,
} from '@business/dto/studyGroupStudent/delete'
import { ITransaction } from '@business/dto/transaction/create'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import {
  IStudyGroupStudentRepository,
  IStudyGroupStudentRepositoryToken,
} from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteStudyGroupStudentUseCase
  implements
    IAbstractUseCase<
      IInputDeleteStudyGroupStudentDto,
      IOutputDeleteStudyGroupStudentDto
    >
{
  constructor(
    @inject(IStudyGroupStudentRepositoryToken)
    private studyGroupStudentRepository: IStudyGroupStudentRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeleteStudyGroupStudentDto,
    trx?: ITransaction
  ): Promise<IOutputDeleteStudyGroupStudentDto> {
    try {
      const studyGroupStudentResult =
        await this.studyGroupStudentRepository.delete(props, trx)

      return right(studyGroupStudentResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupStudentErrors.deleteFailed())
    }
  }
}
