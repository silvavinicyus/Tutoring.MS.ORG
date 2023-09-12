import { IInputDeletePostReactionDto } from '@business/dto/postReactions/delete'
import { IInputFindAllPostReactionsDto } from '@business/dto/postReactions/findAll'
import { IInputFindByPostReactionDto } from '@business/dto/postReactions/findBy'
import { ITransaction } from '@business/dto/transaction/create'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IPostReactionEntity } from '@domain/entities/postReactions'

export const IPostReactionRepositoryToken = Symbol.for(
  'PostReactionRepositorySymbol'
)

export interface IPostReactionRepository {
  create(
    input: IPostReactionEntity,
    trx?: ITransaction
  ): Promise<IPostReactionEntity>
  findBy(input: IInputFindByPostReactionDto): Promise<IPostReactionEntity>
  findAll(
    input: IInputFindAllPostReactionsDto
  ): Promise<IPaginatedResponse<IPostReactionEntity>>
  delete(input: IInputDeletePostReactionDto, trx?: ITransaction): Promise<void>
}
