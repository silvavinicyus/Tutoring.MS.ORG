import { inject, injectable } from 'inversify'
import { IOutputFindAllPostReactionsDto } from '@business/dto/postReactions/findAll'
import { FindAllPostReactionsUseCase } from '@business/useCases/postReaction/findAllPostReactions'
import { InputFindAllPostReactions } from '@controller/serializers/postReaction/findAll'
import { left } from '@shared/either'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllPostReactionsOperator extends AbstractOperator<
  InputFindAllPostReactions,
  IOutputFindAllPostReactionsDto
> {
  constructor(
    @inject(FindAllPostReactionsUseCase)
    private findAllPostReactions: FindAllPostReactionsUseCase,
    @inject(FindByPostUseCase)
    private findPostBy: FindByPostUseCase
  ) {
    super()
  }

  async run(
    input: InputFindAllPostReactions
  ): Promise<IOutputFindAllPostReactionsDto> {
    this.exec(input)

    const post = await this.findPostBy.exec({
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

    const postReactions = await this.findAllPostReactions.exec({
      pagination: { count: input.count, page: input.page },
      filters: {
        contains: [
          ...input.contains,
          { column: 'post_id', value: post.value.id },
        ],
      },
    })

    if (postReactions.isLeft()) {
      return left(postReactions.value)
    }

    return postReactions
  }
}
