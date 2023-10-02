import { inject, injectable } from 'inversify'
import { FindByPostUseCase } from '@business/useCases/post/findByPost'
import { InputFindPostBy } from '@controller/serializers/post/findBy'
import { IOutputFindByPostDto } from '@business/dto/post/findBy'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindPostByOperator extends AbstractOperator<
  InputFindPostBy,
  IOutputFindByPostDto
> {
  constructor(
    @inject(FindByPostUseCase)
    private findByPost: FindByPostUseCase
  ) {
    super()
  }

  async run(input: InputFindPostBy): Promise<IOutputFindByPostDto> {
    this.exec(input)

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
