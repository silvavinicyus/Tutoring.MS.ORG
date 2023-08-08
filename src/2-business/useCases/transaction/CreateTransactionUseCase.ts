import { inject, injectable } from 'inversify'
import { IOutputCreateTransactionDto } from '@business/dto/transaction/create'
import {
  ITransactionRepository,
  ITransactionRepositoryToken,
} from '@business/repositories/transaction/iTransactionRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { TransactionErrors } from '@business/module/errors/transactionErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateTransactionUseCase
  implements IAbstractUseCase<void, IOutputCreateTransactionDto>
{
  constructor(
    @inject(ITransactionRepositoryToken)
    private transactionRepository: ITransactionRepository,
    @inject(ILoggerServiceToken) private logger: ILoggerService
  ) {}

  async exec(): Promise<IOutputCreateTransactionDto> {
    try {
      const transaction = await this.transactionRepository.create()

      return right(transaction)
    } catch (error) {
      this.logger.error(error)
      return left(TransactionErrors.creationError())
    }
  }
}
