import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputDeleteTutoringDto } from '@business/dto/tutoring/delete'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputDeleteTutoringProps = Omit<IInputDeleteTutoringDto, 'id'> & {
  uuid: string
}

export class InputDeleteTutoring extends AbstractSerializer<IInputDeleteTutoringProps> {
  @IsNotEmpty()
  @IsUUID('4')
  uuid: string
}
