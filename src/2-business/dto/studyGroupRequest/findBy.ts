import { IWhere } from '@business/repositories/where'
import {
  IStudyGroupRequestEntity,
  StudyGroupRequestEntityKeys,
} from '@domain/entities/studyGroupRequest'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindByStudyGroupRequestDto
  extends IUseCaseOptions<keyof StudyGroupRequestEntityKeys, string | number> {
  where: IWhere<keyof StudyGroupRequestEntityKeys, string | number>[]
}

export type IOutputFindByStudyGroupRequestDto = Either<
  IError,
  IStudyGroupRequestEntity
>
