import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeletePostReactionDto = {
  id: number
}

export type IOutputDeletePostReactionDto = Either<IError, void>
