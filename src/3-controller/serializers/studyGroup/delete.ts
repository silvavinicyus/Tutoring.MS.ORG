import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputDeleteStudyGroupDto } from '@business/dto/studyGroup/delete'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputDeleteStudyGroupProps = Omit<
  IInputDeleteStudyGroupDto,
  'id'
> & {
  uuid: string
}

export class InputDeleteStudyGroup extends AbstractSerializer<IInputDeleteStudyGroupProps> {
  @IsNotEmpty()
  @IsUUID('4')
  uuid: string
}
