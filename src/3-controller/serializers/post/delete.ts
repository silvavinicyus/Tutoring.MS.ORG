import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputDeletePostDto } from '@business/dto/post/delete'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputDeletePostProps = Omit<IInputDeletePostDto, 'id'> & {
  uuid: string
}

export class InputDeletePost extends AbstractSerializer<IInputDeletePostProps> {
  @IsNotEmpty()
  @IsUUID('4')
  uuid: string
}
