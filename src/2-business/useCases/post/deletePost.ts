import { inject, injectable } from 'inversify'
import {
  IPostRepository,
  IPostRepositoryToken,
} from '@business/repositories/post/iPostRepository'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IInputDeletePostDto,
  IOutputDeletePostDto,
} from '@business/dto/post/delete'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { PostErrors } from '@business/module/errors/postErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeletePostUseCase
  implements IAbstractUseCase<IInputDeletePostDto, IOutputDeletePostDto>
{
  constructor(
    @inject(IPostRepositoryToken)
    private postRepository: IPostRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeletePostDto,
    trx?: ITransaction
  ): Promise<IOutputDeletePostDto> {
    try {
      const postResult = await this.postRepository.delete(props, trx)

      return right(postResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostErrors.deleteFailed())
    }
  }
}
