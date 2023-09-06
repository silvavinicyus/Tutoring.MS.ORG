import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeleteStudyGroupDto = {
  id: number
}

export type IOutputDeleteStudyGroupDto = Either<IError, void>
