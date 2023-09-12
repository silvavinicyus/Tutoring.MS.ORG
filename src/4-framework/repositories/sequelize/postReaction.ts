import { injectable } from 'inversify'
import { IPostReactionRepository } from '@business/repositories/postReaction/iPostReactionRepository'
import { IInputDeletePostReactionDto } from '@business/dto/postReactions/delete'
import { IInputFindAllPostReactionsDto } from '@business/dto/postReactions/findAll'
import { IInputFindByPostReactionDto } from '@business/dto/postReactions/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IPostReactionEntity } from '@domain/entities/postReactions'
import { PostReactionsModel } from '@framework/models/postReactions'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class PostReactionRepository implements IPostReactionRepository {
  async create(
    input: IPostReactionEntity,
    trx?: ITransaction
  ): Promise<IPostReactionEntity> {
    const postReaction = await PostReactionsModel.create(input, {
      transaction: trx,
    })

    return postReaction.get({ plain: true })
  }

  async findBy(
    input: IInputFindByPostReactionDto
  ): Promise<IPostReactionEntity> {
    const options = createFindAllOptions(input)

    const postReaction = await PostReactionsModel.findOne(options)

    if (!postReaction) {
      return void 0
    }

    return postReaction.get({ plain: true })
  }

  async findAll(
    input: IInputFindAllPostReactionsDto
  ): Promise<IPaginatedResponse<IPostReactionEntity>> {
    const options = createFindAllOptions(input)

    const postReactions = await PostReactionsModel.findAll(options)

    return {
      items: postReactions.map((postReaction) =>
        postReaction.get({ plain: true })
      ),
      count: postReactions.length,
      page: input.pagination.page || 0,
      perPage: input.pagination.count || 10,
    }
  }

  async delete(
    input: IInputDeletePostReactionDto,
    trx?: ITransaction
  ): Promise<void> {
    await PostReactionsModel.destroy({
      where: {
        id: input.id,
      },
      transaction: trx,
    })

    return void 0
  }
}
