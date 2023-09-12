import {
  IInputStudyGroupStudentEntity,
  IStudyGroupStudentsEntity,
} from '@domain/entities/studyGroupStudents'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateStudyGroupStudentDto = IInputStudyGroupStudentEntity

export type IOutputCreateStudyGroupStudentDto = Either<
  IError,
  IStudyGroupStudentsEntity
>
