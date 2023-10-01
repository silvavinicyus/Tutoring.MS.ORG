import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeleteTutoringDto = {
  id: number
}

export type IOutputDeleteTutoringDto = Either<IError, void>
