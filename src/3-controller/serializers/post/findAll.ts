import { IsArray, IsInt, IsOptional } from 'class-validator'
import { IInputFindAllPostsDto } from '@business/dto/post/findAll'
import { IOrdenationColumn } from '@shared/utils/order'
import { AbstractSerializer } from '../abstractSerializer'
import { IInputPaginatedProps } from '../inputPaginated'

interface IInputFindAllPostsOperator
  extends IInputPaginatedProps<IInputFindAllPostsDto['filters']['contains']> {}

export class InputFindAllPosts extends AbstractSerializer<IInputFindAllPostsOperator> {
  @IsOptional()
  @IsInt()
  count: number

  @IsOptional()
  @IsInt()
  page: number

  @IsArray()
  contains: IInputFindAllPostsDto['filters']['contains']

  @IsOptional()
  @IsArray()
  orders: IOrdenationColumn[]
}
