import {
  IStudyGroupEntity,
  StudyGroupEntityKeys,
} from '@domain/entities/studyGroup'
import { IWhere } from '@business/repositories/where'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'
import { IPaginatedResponse, IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindAllStudyGroupsDto
  extends IUseCaseOptions<keyof StudyGroupEntityKeys> {
  where?: IWhere<keyof StudyGroupEntityKeys, string | number>[]
}

export type IOutputFindAllStudyGroupsDto = Either<
  IError,
  IPaginatedResponse<IStudyGroupEntity>
>
