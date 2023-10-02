import { IWhere } from '@business/repositories/where'
import { StudyGroupStudentEntityKeys } from '@domain/entities/studyGroupStudents'
import { IUserEntity } from '@domain/entities/user'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IPaginatedResponse, IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindAllStudyGroupStudentsDto
  extends IUseCaseOptions<keyof StudyGroupStudentEntityKeys, string | number> {
  where?: IWhere<keyof StudyGroupStudentEntityKeys, string | number>[]
}

export type IOutputFindAllStudyGroupStudentsDto = Either<
  IError,
  IPaginatedResponse<IUserEntity>
>
