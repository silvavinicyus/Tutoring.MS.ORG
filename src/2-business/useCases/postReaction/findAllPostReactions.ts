import { inject, injectable } from 'inversify'
import {
  IInputFindAllPostReactionsDto,
  IOutputFindAllPostReactionsDto,
} from '@business/dto/postReactions/findAll'
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
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllPostReactionsUseCase
  implements
    IAbstractUseCase<
      IInputFindAllPostReactionsDto,
      IOutputFindAllPostReactionsDto
    >
{
  constructor(
    @inject(IPostReactionRepositoryToken)
    private postReactionRepository: IPostReactionRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindAllPostReactionsDto
  ): Promise<IOutputFindAllPostReactionsDto> {
    try {
      const postReactions = await this.postReactionRepository.findAll(props)

      return right(postReactions)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostReactionErrors.loadFailed())
    }
  }
}
