import { IsNotEmpty, IsUUID } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputFindUserBy extends AbstractSerializer<{ uuid: string }> {
  @IsUUID('4')
  @IsNotEmpty()
  uuid: string
}
