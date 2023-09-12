import { inject, injectable } from 'inversify'
import { IOutputDeletePostReactionDto } from '@business/dto/postReactions/delete'
import { DeletePostReactionUseCase } from '@business/useCases/postReaction/deletePostReaction'
import { FindByPostReactionUseCase } from '@business/useCases/postReaction/findByPostReaction'
import { InputDeletePostReaction } from '@controller/serializers/postReaction/delete'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeletePostReactionOperator extends AbstractOperator<
  InputDeletePostReaction,
  IOutputDeletePostReactionDto
> {
  constructor(
    @inject(DeletePostReactionUseCase)
    private deletePostReaction: DeletePostReactionUseCase,
    @inject(FindByPostReactionUseCase)
    private findPostReaction: FindByPostReactionUseCase
  ) {
    super()
  }

  async run(
    input: InputDeletePostReaction
  ): Promise<IOutputDeletePostReactionDto> {
    this.exec(input)

    const postReaction = await this.findPostReaction.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (postReaction.isLeft()) {
      return left(postReaction.value)
    }

    const postReactionResult = await this.deletePostReaction.exec({
      id: postReaction.value.id,
    })

    if (postReactionResult.isLeft()) {
      return left(postReactionResult.value)
    }

    return postReactionResult
  }
}
