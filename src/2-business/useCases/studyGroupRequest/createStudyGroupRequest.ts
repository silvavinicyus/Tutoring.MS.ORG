import { inject, injectable } from 'inversify'
import {
  IInputCreateStudyGroupRequestDto,
  IOutputCreateStudyGroupRequestDto,
} from '@business/dto/studyGroupRequest/create'
import {
  IInputStudyGroupRequestEntity,
  StudyGroupRequestEntity,
} from '@domain/entities/studyGroupRequest'
import {
  IStudyGroupRequestRepository,
  IStudyGroupRequestRepositoryToken,
} from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { ITransaction } from '@business/dto/transaction/create'
import { left, right } from '@shared/either'
import { StudyGroupRequestErrors } from '@business/module/errors/studyGroupRequestErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateStudyGroupRequestUseCase
  implements
    IAbstractUseCase<
      IInputCreateStudyGroupRequestDto,
      IOutputCreateStudyGroupRequestDto
    >
{
  constructor(
    @inject(IStudyGroupRequestRepositoryToken)
    private studyGroupRequestRepository: IStudyGroupRequestRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputStudyGroupRequestEntity,
    trx?: ITransaction
  ): Promise<IOutputCreateStudyGroupRequestDto> {
    try {
      const studyGroupRequestEntity = StudyGroupRequestEntity.create(
        props,
        new Date()
      )

      const studyGroupRequestResult =
        await this.studyGroupRequestRepository.create(
          {
            ...studyGroupRequestEntity.value.export(),
            uuid: this.uniqueIdentifier.create(),
          },
          trx
        )

      return right(studyGroupRequestResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupRequestErrors.creationError())
    }
  }
}
