import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeleteFileDto = {
  id: number
}

export type IOutputDeleteFileDto = Either<IError, void>
