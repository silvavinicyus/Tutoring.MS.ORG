import {
  IInputStudyGroupLeaderEntity,
  IStudyGroupLeaderEntity,
} from '@domain/entities/studyGroupLeader'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateStudyGroupLeaderDto = IInputStudyGroupLeaderEntity

export type IOutputCreateStudyGroupLeaderDto = Either<
  IError,
  IStudyGroupLeaderEntity
>
