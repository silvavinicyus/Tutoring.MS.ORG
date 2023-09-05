import { IsArray, IsInt, IsOptional } from 'class-validator'
import { IInputFindAllUsersDto } from '@business/dto/user/findAll'
import { IOrdenationColumn } from '@shared/utils/order'
import { AbstractSerializer } from '../abstractSerializer'
import { IInputPaginatedProps } from '../inputPaginated'

interface IInputFindAllUsersOperator
  extends IInputPaginatedProps<IInputFindAllUsersDto['filters']['contains']> {}

export class InputFindAllUsers extends AbstractSerializer<IInputFindAllUsersOperator> {
  @IsOptional()
  @IsInt()
  count: number

  @IsOptional()
  @IsInt()
  page: number

  @IsArray()
  contains: IInputFindAllUsersDto['filters']['contains']

  @IsOptional()
  @IsArray()
  orders: IOrdenationColumn[]
}
