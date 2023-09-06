import { inject, injectable } from 'inversify'
import {
  IInputDeleteStudyGroupDto,
  IOutputDeleteStudyGroupDto,
} from '@business/dto/studyGroup/delete'
import {
  IStudyGroupRepository,
  IStudyGroupRepositoryToken,
} from '@business/repositories/studyGroup/iStudyGroupRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { ITransaction } from '@business/dto/transaction/create'
import { left, right } from '@shared/either'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteStudyGroupUseCase
  implements
    IAbstractUseCase<IInputDeleteStudyGroupDto, IOutputDeleteStudyGroupDto>
{
  constructor(
    @inject(IStudyGroupRepositoryToken)
    private studyGroupRepository: IStudyGroupRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeleteStudyGroupDto,
    trx?: ITransaction
  ): Promise<IOutputDeleteStudyGroupDto> {
    try {
      const studyGroupResult = await this.studyGroupRepository.delete(
        props,
        trx
      )

      return right(studyGroupResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupErrors.deleteFailed())
    }
  }
}
