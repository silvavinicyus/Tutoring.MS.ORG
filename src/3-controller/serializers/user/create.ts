import { IsDate, IsNotEmpty, IsString } from 'class-validator'
import { IInputCreateUserDto } from '@business/dto/user/create'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreateUser extends AbstractSerializer<IInputCreateUserDto> {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsDate()
  @IsNotEmpty()
  birthdate: Date

  @IsString()
  @IsNotEmpty()
  phone: string
}
