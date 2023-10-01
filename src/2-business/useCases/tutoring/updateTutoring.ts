import { inject, injectable } from 'inversify'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IInputUpdateTutoringDto,
  IOutputUpdateTutoringDto,
} from '@business/dto/tutoring/update'
import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import {
  ITutoringRepository,
  ITutoringRepositoryToken,
  updateWhereTutoring,
} from '@business/repositories/tutoring/iTutoringRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { TutoringEntity } from '@domain/entities/tutoring'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class UpdateTutoringUseCase
  implements
    IAbstractUseCase<IInputUpdateTutoringDto, IOutputUpdateTutoringDto>
{
  constructor(
    @inject(ITutoringRepositoryToken)
    private tutoringRepository: ITutoringRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputUpdateTutoringDto,
    updateWhere: updateWhereTutoring,
    trx?: ITransaction
  ): Promise<IOutputUpdateTutoringDto> {
    try {
      const tutoringEntity = TutoringEntity.update(props, new Date())

      const tutoring = await this.tutoringRepository.update(
        {
          newData: tutoringEntity.value.export(),
          updateWhere,
        },
        trx
      )

      if (!tutoring) {
        return left(TutoringErrors.updateError())
      }

      return right(tutoring)
    } catch (err) {
      this.loggerService.error(err)
      return left(TutoringErrors.updateError())
    }
  }
}
