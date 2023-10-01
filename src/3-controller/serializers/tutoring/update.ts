import { IsDate, IsNotEmpty, IsString } from 'class-validator'
import { IInputUpdateTutoringDto } from '@business/dto/tutoring/update'
import { AbstractSerializer } from '../abstractSerializer'

interface IInputUpdateTutoringProps extends IInputUpdateTutoringDto {
  uuid: string
}

export class InputUpdateTutoring extends AbstractSerializer<IInputUpdateTutoringProps> {
  @IsNotEmpty()
  @IsString()
  uuid: string

  @IsNotEmpty()
  @IsDate()
  date: Date
}
