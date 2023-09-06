import { inject, injectable } from 'inversify'
import {
  IInputFindByPostDto,
  IOutputFindByPostDto,
} from '@business/dto/post/findBy'
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
export class FindByPostUseCase
  implements IAbstractUseCase<IInputFindByPostDto, IOutputFindByPostDto>
{
  constructor(
    @inject(IPostRepositoryToken)
    private postRepository: IPostRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(props: IInputFindByPostDto): Promise<IOutputFindByPostDto> {
    try {
      const post = await this.postRepository.findBy(props)

      if (!post) {
        return left(PostErrors.notFound())
      }

      return right(post)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostErrors.loadFailed())
    }
  }
}
