import { IInputCreateFooDto } from '@business/dto/foo/createFooDto'
import { IsNotEmpty, IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreateFoo extends AbstractSerializer<IInputCreateFooDto> {
  @IsString()
  @IsNotEmpty()
  title: string
}
