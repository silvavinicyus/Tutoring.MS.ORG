import { inject, injectable } from 'inversify'
import {
  IInputDeleteTutoringDto,
  IOutputDeleteTutoringDto,
} from '@business/dto/tutoring/delete'
import {
  ITutoringRepository,
  ITutoringRepositoryToken,
} from '@business/repositories/tutoring/iTutoringRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { ITransaction } from '@business/dto/transaction/create'
import { left, right } from '@shared/either'
import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteTutoringUseCase
  implements
    IAbstractUseCase<IInputDeleteTutoringDto, IOutputDeleteTutoringDto>
{
  constructor(
    @inject(ITutoringRepositoryToken)
    private tutoringRepository: ITutoringRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeleteTutoringDto,
    trx?: ITransaction
  ): Promise<IOutputDeleteTutoringDto> {
    try {
      const tutoringResult = await this.tutoringRepository.delete(props, trx)

      return right(tutoringResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(TutoringErrors.deleteFailed())
    }
  }
}
