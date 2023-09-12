import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator'
import { IInputCreatePostReactionDto } from '@business/dto/postReactions/create'
import { PostReactionTypes } from '@domain/entities/postReactions'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputCreatePostReactionProps = Omit<
  IInputCreatePostReactionDto,
  'post_id'
> & {
  post_uuid: string
}

export class InputCreatePostReaction extends AbstractSerializer<IInputCreatePostReactionProps> {
  @IsEnum(PostReactionTypes)
  @IsNotEmpty()
  type: PostReactionTypes

  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @IsNotEmpty()
  @IsUUID('4')
  post_uuid: string
}
