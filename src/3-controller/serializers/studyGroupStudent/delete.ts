import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputDeleteStudyGroupStudentDto } from '@business/dto/studyGroupStudent/delete'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputDeleteStudyGroupStudentProps = Omit<
  IInputDeleteStudyGroupStudentDto,
  'id'
> & {
  uuid: string
}

export class InputDeleteStudyGroupStudent extends AbstractSerializer<IInputDeleteStudyGroupStudentProps> {
  @IsNotEmpty()
  @IsUUID('4')
  uuid: string
}
