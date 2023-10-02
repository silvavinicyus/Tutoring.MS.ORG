import { inject, injectable } from 'inversify'
import { InputFindAllPosts } from '@controller/serializers/post/findAll'
import { IOutputFindAllPostsDto } from '@business/dto/post/findAll'
import { FindAllPostsUseCase } from '@business/useCases/post/findAllPosts'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllPostsOperator extends AbstractOperator<
  InputFindAllPosts,
  IOutputFindAllPostsDto
> {
  constructor(
    @inject(FindAllPostsUseCase)
    private findAllPosts: FindAllPostsUseCase
  ) {
    super()
  }

  async run(input: InputFindAllPosts): Promise<IOutputFindAllPostsDto> {
    this.exec(input)
    const posts = await this.findAllPosts.exec({
      pagination: { count: input.count, page: input.page },
      filters: {
        contains: input.contains,
      },
      relations: [
        {
          tableName: 'owner',
          currentTableColumn: 'user_id',
          foreignJoinColumn: 'id',
        },
        {
          tableName: 'reactions',
          currentTableColumn: 'id',
          foreignJoinColumn: 'post_id',
        },
      ],
    })

    if (posts.isLeft()) {
      return left(posts.value)
    }

    return posts
  }
}
