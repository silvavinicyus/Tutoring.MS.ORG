import { inject, injectable } from 'inversify'
import {
  IInputDeletePostReactionDto,
  IOutputDeletePostReactionDto,
} from '@business/dto/postReactions/delete'
import {
  IPostReactionRepository,
  IPostReactionRepositoryToken,
} from '@business/repositories/postReaction/iPostReactionRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { PostReactionErrors } from '@business/module/errors/postReactionErrors'
import { ITransaction } from '@business/dto/transaction/create'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeletePostReactionUseCase
  implements
    IAbstractUseCase<IInputDeletePostReactionDto, IOutputDeletePostReactionDto>
{
  constructor(
    @inject(IPostReactionRepositoryToken)
    private postReactionRepository: IPostReactionRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeletePostReactionDto,
    trx?: ITransaction
  ): Promise<IOutputDeletePostReactionDto> {
    try {
      const postReactionResult = await this.postReactionRepository.delete(
        props,
        trx
      )

      return right(postReactionResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostReactionErrors.deleteFailed())
    }
  }
}
