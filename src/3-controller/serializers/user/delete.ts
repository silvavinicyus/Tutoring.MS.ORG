import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputDeleteUserDto } from '@business/dto/user/delete'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputDeleteUserProps = Omit<IInputDeleteUserDto, 'id'> & {
  uuid: string
}

export class InputDeleteUser extends AbstractSerializer<IInputDeleteUserProps> {
  @IsNotEmpty()
  @IsUUID('4')
  uuid: string
}
