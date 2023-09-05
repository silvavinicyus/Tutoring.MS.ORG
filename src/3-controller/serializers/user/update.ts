import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { IInputUpdateUserDto } from '@business/dto/user/update'
import { AbstractSerializer } from '../abstractSerializer'

interface IInputUpdateUserProps extends IInputUpdateUserDto {
  uuid: string
}

export class InputUpdateUser extends AbstractSerializer<IInputUpdateUserProps> {
  @IsNotEmpty()
  @IsString()
  uuid: string

  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  phone: string

  @IsOptional()
  @IsDate()
  birthdate: Date
}
