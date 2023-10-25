import { inject, injectable } from 'inversify'
import { InputFindAllPosts } from '@controller/serializers/post/findAll'
import { IOutputFindAllPostsDto } from '@business/dto/post/findAll'
import { FindAllPostsUseCase } from '@business/useCases/post/findAllPosts'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllPostsOperator extends AbstractOperator<
  InputFindAllPosts,
  IOutputFindAllPostsDto
> {
  constructor(
    @inject(FindAllPostsUseCase)
    private findAllPosts: FindAllPostsUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputFindAllPosts,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputFindAllPostsDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['view_post'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

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
