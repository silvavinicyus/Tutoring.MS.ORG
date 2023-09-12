import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputDeletePostReactionDto } from '@business/dto/postReactions/delete'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputDeletePostReactionProps = Omit<
  IInputDeletePostReactionDto,
  'id'
> & {
  uuid: string
}

export class InputDeletePostReaction extends AbstractSerializer<IInputDeletePostReactionProps> {
  @IsNotEmpty()
  @IsUUID('4')
  uuid: string
}
