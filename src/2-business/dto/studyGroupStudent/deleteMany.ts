import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeleteManyGroupStudentsDto = {
  group_id: number
  students_ids?: number[]
}

export type IOutputDeleteManyGroupStudentsDto = Either<IError, void>
