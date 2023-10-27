import { IsNotEmpty, IsString } from 'class-validator'
import { IInputCreateStudyGroupDto } from '@business/dto/studyGroup/create'
import { AbstractSerializer } from '../abstractSerializer'

export type IInputCreateStudyGroupProps = Omit<
  IInputCreateStudyGroupDto,
  'creator_id'
>

export class InputCreateStudyGroup extends AbstractSerializer<IInputCreateStudyGroupProps> {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  subject: string
}
