import { inject, injectable } from 'inversify'
import { DeletePostUseCase } from '@business/useCases/post/deletePost'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { IOutputDeletePostDto } from '@business/dto/post/delete'
import { InputDeletePost } from '@controller/serializers/post/delete'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeletePostOperator extends AbstractOperator<
  InputDeletePost,
  IOutputDeletePostDto
> {
  constructor(
    @inject(DeletePostUseCase)
    private deletePost: DeletePostUseCase,
    @inject(FindByPostUseCase)
    private findPost: FindByPostUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputDeletePost,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputDeletePostDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['delete_post'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const post = await this.findPost.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (post.isLeft()) {
      return left(post.value)
    }

    const postResult = await this.deletePost.exec({
      id: post.value.id,
    })

    if (postResult.value) {
      return left(postResult.value)
    }

    return postResult
  }
}
