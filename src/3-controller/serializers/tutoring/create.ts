import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { IInputCreateTutoringDto } from '@business/dto/tutoring/create'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputCreateTutoringProps = Omit<
  IInputCreateTutoringDto,
  'student_id' | 'tutor_id'
> & {
  student_uuid: string
  tutor_uuid: string
}

export class InputCreateTutoring extends AbstractSerializer<IInputCreateTutoringProps> {
  @IsNotEmpty()
  @IsString()
  subject: string

  @IsDate()
  @IsNotEmpty()
  date: Date

  @IsUUID('4')
  @IsNotEmpty()
  tutor_uuid: string

  @IsNotEmpty()
  @IsUUID('4')
  student_uuid: number
}
