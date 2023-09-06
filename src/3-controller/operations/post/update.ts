import { inject, injectable } from 'inversify'
import { IOutputUpdatePostDto } from '@business/dto/post/update'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { UpdatePostUseCase } from '@business/useCases/post/updatePost'
import { InputUpdatePost } from '@controller/serializers/post/update'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdatePostOperator extends AbstractOperator<
  InputUpdatePost,
  IOutputUpdatePostDto
> {
  constructor(
    @inject(UpdatePostUseCase)
    private updatePost: UpdatePostUseCase,
    @inject(FindByPostUseCase)
    private findPostBy: FindByPostUseCase
  ) {
    super()
  }

  async run(input: InputUpdatePost): Promise<IOutputUpdatePostDto> {
    this.exec(input)

    const post = await this.findPostBy.exec({
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

    const postResult = await this.updatePost.exec(
      {
        ...input,
      },
      {
        column: 'uuid',
        value: input.uuid,
      }
    )

    if (postResult.isLeft()) {
      return left(postResult.value)
    }

    return postResult
  }
}
