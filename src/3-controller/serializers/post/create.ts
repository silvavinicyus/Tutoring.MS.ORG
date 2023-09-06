import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { IInputCreatePostDto } from '@business/dto/post/create'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreatePost extends AbstractSerializer<IInputCreatePostDto> {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  content: string

  @IsOptional()
  @IsNumber()
  image_id?: number

  @IsNotEmpty()
  @IsNumber()
  group_id: number

  @IsNotEmpty()
  @IsNumber()
  owner_id: number

  @IsNotEmpty()
  @IsBoolean()
  fixed: boolean
}
