import { inject, injectable } from 'inversify'
import {
  IInputCreatePostDto,
  IOutputCreatePostDto,
} from '@business/dto/post/create'
import { IInputPostEntity, PostEntity } from '@domain/entities/post'
import {
  IPostRepository,
  IPostRepositoryToken,
} from '@business/repositories/post/iPostRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { ITransaction } from '@business/dto/transaction/create'
import { left, right } from '@shared/either'
import { PostErrors } from '@business/module/errors/postErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreatePostUseCase
  implements IAbstractUseCase<IInputCreatePostDto, IOutputCreatePostDto>
{
  constructor(
    @inject(IPostRepositoryToken)
    private postRepository: IPostRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputPostEntity,
    trx?: ITransaction
  ): Promise<IOutputCreatePostDto> {
    try {
      const postEntity = PostEntity.create(props, new Date())
      const postResult = await this.postRepository.create(
        {
          ...postEntity.value.export(),
          uuid: this.uniqueIdentifier.create(),
        },
        trx
      )

      return right(postResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(PostErrors.creationError())
    }
  }
}
