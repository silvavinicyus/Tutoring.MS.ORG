import { inject, injectable } from 'inversify'
import { IOutputCreatePostReactionDto } from '@business/dto/postReactions/create'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { CreatePostReactionUseCase } from '@business/useCases/postReaction/createPostReaction'
import { InputCreatePostReaction } from '@controller/serializers/postReaction/create'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreatePostReactionOperator extends AbstractOperator<
  InputCreatePostReaction,
  IOutputCreatePostReactionDto
> {
  constructor(
    @inject(CreatePostReactionUseCase)
    private createPostReaction: CreatePostReactionUseCase,
    @inject(FindByPostUseCase)
    private findPost: FindByPostUseCase
  ) {
    super()
  }

  async run(
    input: InputCreatePostReaction
  ): Promise<IOutputCreatePostReactionDto> {
    this.exec(input)

    const post = await this.findPost.exec({
      where: [
        {
          column: 'uuid',
          value: input.post_uuid,
        },
      ],
    })

    if (post.isLeft()) {
      return left(post.value)
    }

    const postReaction = await this.createPostReaction.exec({
      ...input,
      post_id: post.value.id,
    })

    if (postReaction.isLeft()) {
      return left(postReaction.value)
    }

    return postReaction
  }
}
