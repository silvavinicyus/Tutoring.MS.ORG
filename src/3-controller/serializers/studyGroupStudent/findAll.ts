import { IsArray, IsInt, IsOptional, IsString, IsUUID } from 'class-validator'
import { IOrdenationColumn } from '@shared/utils/order'
import { IInputFindAllStudyGroupStudentsDto } from '@business/dto/studyGroupStudent/findAll'
import { AbstractSerializer } from '../abstractSerializer'
import { IInputPaginatedProps } from '../inputPaginated'

interface IInputFindAllStudyGroupStudentsOperator
  extends IInputPaginatedProps<
    IInputFindAllStudyGroupStudentsDto['filters']['contains']
  > {
  group_uuid: string
}

export class InputFindAllStudyGroupStudents extends AbstractSerializer<IInputFindAllStudyGroupStudentsOperator> {
  @IsOptional()
  @IsInt()
  count: number

  @IsOptional()
  @IsInt()
  page: number

  @IsArray()
  contains: IInputFindAllStudyGroupStudentsDto['filters']['contains']

  @IsOptional()
  @IsArray()
  orders: IOrdenationColumn[]

  @IsUUID('4')
  @IsString()
  group_uuid: string
}
