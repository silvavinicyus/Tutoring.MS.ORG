import { inject, injectable } from 'inversify'
import {
  IInputCreateStudyGroupDto,
  IOutputCreateStudyGroupDto,
} from '@business/dto/studyGroup/create'
import {
  IInputStudyGroupEntity,
  StudyGroupEntity,
} from '@domain/entities/studyGroup'
import {
  IStudyGroupRepository,
  IStudyGroupRepositoryToken,
} from '@business/repositories/studyGroup/iStudyGroupRepository'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { ITransaction } from '@business/dto/transaction/create'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateStudyGroupUseCase
  implements
    IAbstractUseCase<IInputCreateStudyGroupDto, IOutputCreateStudyGroupDto>
{
  constructor(
    @inject(IStudyGroupRepositoryToken)
    private studyGroupRepository: IStudyGroupRepository,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputStudyGroupEntity,
    trx?: ITransaction
  ): Promise<IOutputCreateStudyGroupDto> {
    try {
      const studyGroupEntity = StudyGroupEntity.create(props, new Date())
      const studyGroupResult = await this.studyGroupRepository.create(
        {
          ...studyGroupEntity.value.export(),
          uuid: this.uniqueIdentifier.create(),
        },
        trx
      )

      return right(studyGroupResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupErrors.creationError())
    }
  }
}
