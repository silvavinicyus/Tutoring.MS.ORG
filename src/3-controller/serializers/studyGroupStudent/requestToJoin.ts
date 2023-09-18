import { IsNotEmpty, IsUUID } from 'class-validator'
import { IInputCreateStudyGroupRequestDto } from '@business/dto/studyGroupRequest/create'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputRequestToJoinStudyGroupProps = Omit<
  IInputCreateStudyGroupRequestDto,
  'group_id' | 'requester_id'
> & {
  group_uuid: string
  requester_uuid: string
}

export class InputRequestToJoinStudyGroup extends AbstractSerializer<IInputRequestToJoinStudyGroupProps> {
  @IsNotEmpty()
  @IsUUID('4')
  group_uuid: string

  @IsNotEmpty()
  @IsUUID('4')
  requester_uuid: string
}
