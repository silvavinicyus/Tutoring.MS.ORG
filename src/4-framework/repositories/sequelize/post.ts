import { injectable } from 'inversify'
import {
  IInputUpdatePost,
  IPostRepository,
} from '@business/repositories/post/iPostRepository'
import { IInputDeletePostDto } from '@business/dto/post/delete'
import { IInputFindAllPostsDto } from '@business/dto/post/findAll'
import { IInputFindByPostDto } from '@business/dto/post/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IPostEntity } from '@domain/entities/post'
import { PostModel } from '@framework/models/post'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class PostRepository implements IPostRepository {
  async create(input: IPostEntity, trx?: ITransaction): Promise<IPostEntity> {
    const postResult = await PostModel.create(input, {
      transaction: trx,
    })

    return postResult.get({ plain: true })
  }

  async findBy(input: IInputFindByPostDto): Promise<IPostEntity> {
    const options = createFindAllOptions(input)

    const post = await PostModel.findOne(options)

    if (!post) {
      return void 0
    }

    return post.get({ plain: true })
  }

  async findAll(
    input: IInputFindAllPostsDto
  ): Promise<IPaginatedResponse<IPostEntity>> {
    const options = createFindAllOptions(input)

    const users = await PostModel.findAll(options)

    return {
      items: users.map((post) => post.get({ plain: true })),
      count: users.length,
      page: input.pagination.page || 0,
      perPage: input.pagination.count || 10,
    }
  }

  async update(
    input: IInputUpdatePost,
    trx?: ITransaction
  ): Promise<Partial<IPostEntity>> {
    await PostModel.update(input.newData, {
      where: { [input.updateWhere.column]: input.updateWhere.value },
      transaction: trx,
    })

    return input.newData as IPostEntity
  }

  async delete(input: IInputDeletePostDto, trx?: ITransaction): Promise<void> {
    await PostModel.destroy({
      where: {
        id: input.id,
      },
      transaction: trx,
    })

    return void 0
  }
}
