import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { IInputUpdatePostDto } from '@business/dto/post/update'
import { AbstractSerializer } from '../abstractSerializer'

interface IInputUpdatePostProps extends IInputUpdatePostDto {
  uuid: string
}

export class InputUpdatePost extends AbstractSerializer<IInputUpdatePostProps> {
  @IsNotEmpty()
  @IsString()
  uuid: string

  @IsOptional()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  content: string

  @IsOptional()
  @IsBoolean()
  fixed: boolean

  @IsOptional()
  @IsNumber()
  image_id: number
}
