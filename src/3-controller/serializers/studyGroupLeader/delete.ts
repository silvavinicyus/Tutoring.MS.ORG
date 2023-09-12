import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputDeleteStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/delete'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputDeleteStudyGroupLeaderProps = Omit<
  IInputDeleteStudyGroupLeaderDto,
  'id'
> & {
  uuid: string
}

export class InputDeleteStudyGroupLeader extends AbstractSerializer<IInputDeleteStudyGroupLeaderProps> {
  @IsNotEmpty()
  @IsUUID('4')
  uuid: string
}
