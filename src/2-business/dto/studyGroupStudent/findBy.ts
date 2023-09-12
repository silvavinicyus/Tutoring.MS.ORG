import {
  IStudyGroupStudentsEntity,
  StudyGroupStudentEntityKeys,
} from '@domain/entities/studyGroupStudents'
import { IWhere } from '@business/repositories/where'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindByStudyGroupStudentDto
  extends IUseCaseOptions<keyof StudyGroupStudentEntityKeys, string | number> {
  where?: IWhere<keyof StudyGroupStudentEntityKeys, string | number>[]
}

export type IOutputFindByStudyGroupStudentDto = Either<
  IError,
  IStudyGroupStudentsEntity
>
