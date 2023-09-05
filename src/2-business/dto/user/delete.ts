import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeleteUserDto = {
  id: number
}

export type IOutputDeleteUserDto = Either<IError, void>
