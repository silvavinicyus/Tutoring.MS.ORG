import { inject, injectable } from 'inversify'
import {
  IInputCreateStudyGroupLeaderDto,
  IOutputCreateStudyGroupLeaderDto,
} from '@business/dto/studyGroupLeader/create'
import {
  IInputStudyGroupLeaderEntity,
  StudyGroupLeaderEntity,
} from '@domain/entities/studyGroupLeader'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IStudyGroupLeaderRepository,
  IStudyGroupLeaderRepositoryToken,
} from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { left, right } from '@shared/either'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateStudyGroupLeaderUseCase
  implements
    IAbstractUseCase<
      IInputCreateStudyGroupLeaderDto,
      IOutputCreateStudyGroupLeaderDto
    >
{
  constructor(
    @inject(IStudyGroupLeaderRepositoryToken)
    private studyGroupLeaderRepository: IStudyGroupLeaderRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputStudyGroupLeaderEntity,
    trx?: ITransaction
  ): Promise<IOutputCreateStudyGroupLeaderDto> {
    try {
      const studyGroupLeaderEntity = StudyGroupLeaderEntity.create(
        props,
        new Date()
      )

      const studyGroupLeaderResult =
        await this.studyGroupLeaderRepository.create(
          {
            ...studyGroupLeaderEntity.value.export(),
            uuid: this.uniqueIdentifier.create(),
          },
          trx
        )

      return right(studyGroupLeaderResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupLeaderErrors.creationError())
    }
  }
}
