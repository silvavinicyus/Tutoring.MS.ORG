import { IsArray, IsInt, IsOptional, IsString, IsUUID } from 'class-validator'
import { IInputFindAllPostReactionsDto } from '@business/dto/postReactions/findAll'
import { IOrdenationColumn } from '@shared/utils/order'
import { AbstractSerializer } from '../abstractSerializer'
import { IInputPaginatedProps } from '../inputPaginated'

interface IInputFindAllPostReactionsOperator
  extends IInputPaginatedProps<
    IInputFindAllPostReactionsDto['filters']['contains']
  > {
  post_uuid: string
}

export class InputFindAllPostReactions extends AbstractSerializer<IInputFindAllPostReactionsOperator> {
  @IsOptional()
  @IsInt()
  count: number

  @IsOptional()
  @IsInt()
  page: number

  @IsArray()
  contains: IInputFindAllPostReactionsDto['filters']['contains']

  @IsOptional()
  @IsArray()
  orders: IOrdenationColumn[]

  @IsUUID('4')
  @IsString()
  post_uuid: string
}
