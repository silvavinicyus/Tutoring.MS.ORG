import { inject, injectable } from 'inversify'
import {
  IInputDeleteManyGroupStudentsDto,
  IOutputDeleteManyGroupStudentsDto,
} from '@business/dto/studyGroupStudent/deleteMany'
import {
  IStudyGroupStudentRepository,
  IStudyGroupStudentRepositoryToken,
} from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { ITransaction } from '@business/dto/transaction/create'
import { left, right } from '@shared/either'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteManyStudyGroupStudentsUseCase
  implements
    IAbstractUseCase<
      IInputDeleteManyGroupStudentsDto,
      IOutputDeleteManyGroupStudentsDto
    >
{
  constructor(
    @inject(IStudyGroupStudentRepositoryToken)
    private studyGroupStudentRepository: IStudyGroupStudentRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeleteManyGroupStudentsDto,
    trx?: ITransaction
  ): Promise<IOutputDeleteManyGroupStudentsDto> {
    try {
      const groupStudentResult =
        await this.studyGroupStudentRepository.deleteMany(props, trx)

      return right(groupStudentResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupStudentErrors.deleteFailed())
    }
  }
}
