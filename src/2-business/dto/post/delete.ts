import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeletePostDto = {
  id: number
}

export type IOutputDeletePostDto = Either<IError, void>
