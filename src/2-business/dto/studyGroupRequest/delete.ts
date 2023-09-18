import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeleteStudyGroupRequestDto = {
  uuid: string
}

export type IOutputDeleteStudyGroupRequestDto = Either<IError, void>
