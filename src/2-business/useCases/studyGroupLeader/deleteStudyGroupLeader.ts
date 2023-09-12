import { inject, injectable } from 'inversify'
import {
  IInputDeleteStudyGroupLeaderDto,
  IOutputDeleteStudyGroupLeaderDto,
} from '@business/dto/studyGroupLeader/delete'
import { ITransaction } from '@business/dto/transaction/create'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import {
  IStudyGroupLeaderRepository,
  IStudyGroupLeaderRepositoryToken,
} from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteStudyGroupLeaderUseCase
  implements
    IAbstractUseCase<
      IInputDeleteStudyGroupLeaderDto,
      IOutputDeleteStudyGroupLeaderDto
    >
{
  constructor(
    @inject(IStudyGroupLeaderRepositoryToken)
    private studyGroupLeaderRepository: IStudyGroupLeaderRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeleteStudyGroupLeaderDto,
    trx?: ITransaction
  ): Promise<IOutputDeleteStudyGroupLeaderDto> {
    try {
      const studyGroupLeaderResult =
        await this.studyGroupLeaderRepository.delete(props, trx)

      return right(studyGroupLeaderResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupLeaderErrors.deleteFailed())
    }
  }
}
