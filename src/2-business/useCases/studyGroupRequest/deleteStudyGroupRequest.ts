import { inject, injectable } from 'inversify'
import {
  IInputDeleteStudyGroupRequestDto,
  IOutputDeleteStudyGroupRequestDto,
} from '@business/dto/studyGroupRequest/delete'
import { ITransaction } from '@business/dto/transaction/create'
import { StudyGroupRequestErrors } from '@business/module/errors/studyGroupRequestErrors'
import {
  IStudyGroupRequestRepository,
  IStudyGroupRequestRepositoryToken,
} from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteStudyGroupRequestUseCase
  implements
    IAbstractUseCase<
      IInputDeleteStudyGroupRequestDto,
      IOutputDeleteStudyGroupRequestDto
    >
{
  constructor(
    @inject(IStudyGroupRequestRepositoryToken)
    private studyGroupRequestRepository: IStudyGroupRequestRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeleteStudyGroupRequestDto,
    trx?: ITransaction
  ): Promise<IOutputDeleteStudyGroupRequestDto> {
    try {
      const studyGroupRequestResult =
        await this.studyGroupRequestRepository.delete(props, trx)

      return right(studyGroupRequestResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupRequestErrors.deleteFailed())
    }
  }
}
