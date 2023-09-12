import { IWhere } from '@business/repositories/where'
import {
  IStudyGroupLeaderEntity,
  StudyGroupLeaderEntityKeys,
} from '@domain/entities/studyGroupLeader'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindByStudyGroupLeaderDto
  extends IUseCaseOptions<keyof StudyGroupLeaderEntityKeys, string | number> {
  where?: IWhere<keyof StudyGroupLeaderEntityKeys, string | number>[]
}

export type IOutputFindByStudyGroupLeaderDto = Either<
  IError,
  IStudyGroupLeaderEntity
>
