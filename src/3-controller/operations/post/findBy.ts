import { inject, injectable } from 'inversify'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { InputFindPostBy } from '@controller/serializers/post/findBy'
import { IOutputFindByPostDto } from '@business/dto/post/findBy'
import { left } from '@shared/either'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindPostByOperator extends AbstractOperator<
  InputFindPostBy,
  IOutputFindByPostDto
> {
  constructor(
    @inject(FindByPostUseCase)
    private findByPost: FindByPostUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase
  ) {
    super()
  }

  async run(
    input: InputFindPostBy,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputFindByPostDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['view_post'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const post = await this.findByPost.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
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

    if (post.isLeft()) {
      return left(post.value)
    }

    return post
  }
}
