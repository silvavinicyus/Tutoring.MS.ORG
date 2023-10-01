import { inject, injectable } from 'inversify'
import {
  IInputCreateTutoringDto,
  IOutputCreateTutoringDto,
} from '@business/dto/tutoring/create'
import { IInputTutoringEntity, TutoringEntity } from '@domain/entities/tutoring'
import {
  ITutoringRepository,
  ITutoringRepositoryToken,
} from '@business/repositories/tutoring/iTutoringRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { left, right } from '@shared/either'
import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { ITransaction } from '@business/dto/transaction/create'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateTutoringUseCase
  implements
    IAbstractUseCase<IInputCreateTutoringDto, IOutputCreateTutoringDto>
{
  constructor(
    @inject(ITutoringRepositoryToken)
    private tutoringRepository: ITutoringRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputTutoringEntity,
    trx?: ITransaction
  ): Promise<IOutputCreateTutoringDto> {
    try {
      const tutoringEntity = TutoringEntity.create(props, new Date())
      const tutoringResult = await this.tutoringRepository.create(
        {
          ...tutoringEntity.value.export(),
          uuid: this.uniqueIdentifier.create(),
        },
        trx
      )

      return right(tutoringResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(TutoringErrors.creationError())
    }
  }
}
