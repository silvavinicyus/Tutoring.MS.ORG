import { inject, injectable } from 'inversify'
import {
  IInputFindByPostReactionDto,
  IOutputFindByPostReactionDto,
} from '@business/dto/postReactions/findBy'
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
export class FindByPostReactionUseCase
  implements
    IAbstractUseCase<IInputFindByPostReactionDto, IOutputFindByPostReactionDto>
{
  constructor(
    @inject(IPostReactionRepositoryToken)
    private postReactionRepository: IPostReactionRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindByPostReactionDto
  ): Promise<IOutputFindByPostReactionDto> {
    try {
      const postReaction = await this.postReactionRepository.findBy(props)

      if (!postReaction) {
        return left(PostReactionErrors.notFound())
      }

      return right(postReaction)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostReactionErrors.loadFailed())
    }
  }
}
