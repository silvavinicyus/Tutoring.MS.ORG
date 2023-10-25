import { inject, injectable } from 'inversify'
import { IOutputCreatePostReactionDto } from '@business/dto/postReactions/create'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { CreatePostReactionUseCase } from '@business/useCases/postReaction/createPostReaction'
import { InputCreatePostReaction } from '@controller/serializers/postReaction/create'
import { left } from '@shared/either'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
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
    private findPost: FindByPostUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputCreatePostReaction,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputCreatePostReactionDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['create_post_reaction'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

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
