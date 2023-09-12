import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputCreateStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/create'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputCreateStudyGroupLeaderProps = Omit<
  IInputCreateStudyGroupLeaderDto,
  'group_id' | 'leader_id'
> & {
  group_uuid: string
  leader_uuid: string
}

export class InputCreateStudyGroupLeader extends AbstractSerializer<IInputCreateStudyGroupLeaderProps> {
  @IsNotEmpty()
  @IsUUID('4')
  leader_uuid: string

  @IsNotEmpty()
  @IsUUID('4')
  group_uuid: string
}
