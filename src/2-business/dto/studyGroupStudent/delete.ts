import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeleteStudyGroupStudentDto = {
  id: number
}

export type IOutputDeleteStudyGroupStudentDto = Either<IError, void>
