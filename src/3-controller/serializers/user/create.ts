import { IsDate, IsNotEmpty, IsString, Length } from 'class-validator'
import { IInputCreateUserDto } from '@business/dto/user/create'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputCreateUserProps = IInputCreateUserDto & {
  password: string
}

export class InputCreateUser extends AbstractSerializer<IInputCreateUserProps> {
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

  @IsString()
  @Length(8)
  password: string
}
