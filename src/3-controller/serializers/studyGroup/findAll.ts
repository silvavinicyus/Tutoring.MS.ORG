import { IsArray, IsInt, IsOptional } from 'class-validator'
import { IInputFindAllStudyGroupsDto } from '@business/dto/studyGroup/findAll'
import { IOrdenationColumn } from '@shared/utils/order'
import { AbstractSerializer } from '../abstractSerializer'
import { IInputPaginatedProps } from '../inputPaginated'

interface IInputFindAllStudyGroupsOperator
  extends IInputPaginatedProps<
    IInputFindAllStudyGroupsDto['filters']['contains']
  > {}

export class InputFindAllStudyGroups extends AbstractSerializer<IInputFindAllStudyGroupsOperator> {
  @IsOptional()
  @IsInt()
  count: number

  @IsOptional()
  @IsInt()
  page: number

  @IsArray()
  contains: IInputFindAllStudyGroupsDto['filters']['contains']

  @IsOptional()
  @IsArray()
  orders: IOrdenationColumn[]
}
