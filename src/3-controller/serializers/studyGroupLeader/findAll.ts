import { IsArray, IsInt, IsOptional, IsString, IsUUID } from 'class-validator'
import { IOrdenationColumn } from '@shared/utils/order'
import { IInputFindAllStudyGroupLeadersDto } from '@business/dto/studyGroupLeader/findAll'
import { AbstractSerializer } from '../abstractSerializer'
import { IInputPaginatedProps } from '../inputPaginated'

interface IInputFindAllStudyGroupLeadersOperator
  extends IInputPaginatedProps<
    IInputFindAllStudyGroupLeadersDto['filters']['contains']
  > {
  group_uuid: string
}

export class InputFindAllStudyGroupLeaders extends AbstractSerializer<IInputFindAllStudyGroupLeadersOperator> {
  @IsOptional()
  @IsInt()
  count: number

  @IsOptional()
  @IsInt()
  page: number

  @IsArray()
  contains: IInputFindAllStudyGroupLeadersDto['filters']['contains']

  @IsOptional()
  @IsArray()
  orders: IOrdenationColumn[]

  @IsUUID('4')
  @IsString()
  group_uuid: string
}
