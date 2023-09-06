import { inject, injectable } from 'inversify'
import {
  IInputFindAllPostsDto,
  IOutputFindAllPostsDto,
} from '@business/dto/post/findAll'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IPostRepository,
  IPostRepositoryToken,
} from '@business/repositories/post/iPostRepository'
import { left, right } from '@shared/either'
import { PostErrors } from '@business/module/errors/postErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllPostsUseCase
  implements IAbstractUseCase<IInputFindAllPostsDto, IOutputFindAllPostsDto>
{
  constructor(
    @inject(IPostRepositoryToken)
    private postRepository: IPostRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(props: IInputFindAllPostsDto): Promise<IOutputFindAllPostsDto> {
    try {
      const posts = await this.postRepository.findAll(props)

      return right(posts)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostErrors.loadFailed())
    }
  }
}
