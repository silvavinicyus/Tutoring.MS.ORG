import { inject, injectable } from 'inversify'
import {
  IInputCreatePostReactionDto,
  IOutputCreatePostReactionDto,
} from '@business/dto/postReactions/create'
import {
  IInputPostReactionEntity,
  PostReactionEntity,
} from '@domain/entities/postReactions'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IPostReactionRepository,
  IPostReactionRepositoryToken,
} from '@business/repositories/postReaction/iPostReactionRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { left, right } from '@shared/either'
import { PostReactionErrors } from '@business/module/errors/postReactionErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreatePostReactionUseCase
  implements
    IAbstractUseCase<IInputCreatePostReactionDto, IOutputCreatePostReactionDto>
{
  constructor(
    @inject(IPostReactionRepositoryToken)
    private postReactionRepository: IPostReactionRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputPostReactionEntity,
    trx?: ITransaction
  ): Promise<IOutputCreatePostReactionDto> {
    try {
      const postReactionEntity = PostReactionEntity.create(props, new Date())

      const postReactionResult = await this.postReactionRepository.create(
        {
          ...postReactionEntity.value.export(),
          uuid: this.uniqueIdentifier.create(),
        },
        trx
      )

      return right(postReactionResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostReactionErrors.creationError())
    }
  }
}
