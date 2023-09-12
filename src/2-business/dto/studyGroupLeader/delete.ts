import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeleteStudyGroupLeaderDto = {
  id: number
}

export type IOutputDeleteStudyGroupLeaderDto = Either<IError, void>
