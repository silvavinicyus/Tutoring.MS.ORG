import {
  IInputStudyGroupEntity,
  IStudyGroupEntity,
} from '@domain/entities/studyGroup'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateStudyGroupDto = IInputStudyGroupEntity

export type IOutputCreateStudyGroupDto = Either<IError, IStudyGroupEntity>
