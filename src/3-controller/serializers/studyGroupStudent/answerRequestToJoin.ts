import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputAnswerRequestToJoinProps {
  answer: boolean
  group_request_uuid: string
}

export type IOutputAnswerRequestToJoinDto = Either<IError, void>

export class InputAnswerRequestToJoinStudyGroup extends AbstractSerializer<IInputAnswerRequestToJoinProps> {
  @IsBoolean()
  @IsNotEmpty()
  answer: boolean

  @IsNotEmpty()
  @IsUUID('4')
  group_request_uuid: string
}
