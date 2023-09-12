import { IWhere } from '@business/repositories/where'
import {
  IStudyGroupLeaderEntity,
  StudyGroupLeaderEntityKeys,
} from '@domain/entities/studyGroupLeader'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IPaginatedResponse, IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindAllStudyGroupLeadersDto
  extends IUseCaseOptions<keyof StudyGroupLeaderEntityKeys, string | number> {
  where?: IWhere<keyof StudyGroupLeaderEntityKeys, string | number>[]
}

export type IOutputFindAllStudyGroupLeadersDto = Either<
  IError,
  IPaginatedResponse<IStudyGroupLeaderEntity>
>
