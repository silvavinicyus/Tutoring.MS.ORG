import { inject, injectable } from 'inversify'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IInputUpdatePostDto,
  IOutputUpdatePostDto,
} from '@business/dto/post/update'
import { PostErrors } from '@business/module/errors/postErrors'
import {
  IPostRepository,
  IPostRepositoryToken,
  updateWherePost,
} from '@business/repositories/post/iPostRepository'
import { PostEntity } from '@domain/entities/post'
import { left, right } from '@shared/either'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class UpdatePostUseCase
  implements IAbstractUseCase<IInputUpdatePostDto, IOutputUpdatePostDto>
{
  constructor(
    @inject(IPostRepositoryToken)
    private postRepository: IPostRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputUpdatePostDto,
    updateWhere: updateWherePost,
    trx?: ITransaction
  ): Promise<IOutputUpdatePostDto> {
    try {
      const postEntity = PostEntity.update(props, new Date())

      const post = await this.postRepository.update(
        {
          newData: postEntity.value.export(),
          updateWhere,
        },
        trx
      )

      if (!post) {
        return left(PostErrors.updateError())
      }

      return right(post)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostErrors.updateError())
    }
  }
}
