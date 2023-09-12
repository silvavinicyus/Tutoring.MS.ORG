import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputCreateStudyGroupStudentDto } from '@business/dto/studyGroupStudent/create'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputCreateStudyGroupStudentProps = Omit<
  IInputCreateStudyGroupStudentDto,
  'group_id' | 'student_id'
> & {
  group_uuid: string
  student_uuid: string
}

export class InputCreateStudyGroupStudent extends AbstractSerializer<IInputCreateStudyGroupStudentProps> {
  @IsNotEmpty()
  @IsUUID('4')
  student_uuid: string

  @IsNotEmpty()
  @IsUUID('4')
  group_uuid: string
}
