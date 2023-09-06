import { ITransaction } from '@business/dto/transaction/create'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'

import { IPostEntity, PostEntityKeys } from '@domain/entities/post'
import { IInputUpdatePostDto } from '@business/dto/post/update'
import { IInputFindByPostDto } from '@business/dto/post/findBy'
import { IInputFindAllPostsDto } from '@business/dto/post/findAll'
import { IInputDeletePostDto } from '@business/dto/post/delete'
import { IWhere } from '../where'

export const IPostRepositoryToken = Symbol.for('PostRepositorySymbol')

export type updateWherePost = IWhere<keyof PostEntityKeys, string | number>

export interface IInputUpdatePost {
  updateWhere: updateWherePost
  newData: IInputUpdatePostDto
}

export interface IPostRepository {
  create(input: IPostEntity, trx?: ITransaction): Promise<IPostEntity>
  findBy(input: IInputFindByPostDto): Promise<IPostEntity>
  findAll(
    input: IInputFindAllPostsDto
  ): Promise<IPaginatedResponse<IPostEntity>>
  update(
    input: IInputUpdatePost,
    trx?: ITransaction
  ): Promise<Partial<IPostEntity>>
  delete(input: IInputDeletePostDto, trx?: ITransaction): Promise<void>
}
