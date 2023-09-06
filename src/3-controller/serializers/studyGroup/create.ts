import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { IInputCreateStudyGroupDto } from '@business/dto/studyGroup/create'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreateStudyGroup extends AbstractSerializer<IInputCreateStudyGroupDto> {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  subject: string

  @IsNotEmpty()
  @IsNumber()
  creator_id: number
}
