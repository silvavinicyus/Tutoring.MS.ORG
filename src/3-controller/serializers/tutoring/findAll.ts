import { IsArray, IsInt, IsOptional } from 'class-validator'
import { IInputFindAllTutoringsDto } from '@business/dto/tutoring/findAll'
import { IOrdenationColumn } from '@shared/utils/order'
import { AbstractSerializer } from '../abstractSerializer'
import { IInputPaginatedProps } from '../inputPaginated'

interface IInputFindAllTutoringsOperator
  extends IInputPaginatedProps<
    IInputFindAllTutoringsDto['filters']['contains']
  > {}

export class InputFindAllTutorings extends AbstractSerializer<IInputFindAllTutoringsOperator> {
  @IsOptional()
  @IsInt()
  count: number

  @IsOptional()
  @IsInt()
  page: number

  @IsArray()
  contains: IInputFindAllTutoringsDto['filters']['contains']

  @IsOptional()
  @IsArray()
  orders: IOrdenationColumn[]
}
