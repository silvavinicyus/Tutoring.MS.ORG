import { Either } from '@shared/either'
import { IError } from '@shared/IError'

export type IInputBotAuthorizationDto = {
  token: string
}

export type IOutputBotAuthorizationDto = Either<IError, boolean>
