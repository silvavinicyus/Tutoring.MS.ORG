import {
  IInputStudyGroupRequestEntity,
  IStudyGroupRequestEntity,
} from '@domain/entities/studyGroupRequest'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateStudyGroupRequestDto = IInputStudyGroupRequestEntity

export type IOutputCreateStudyGroupRequestDto = Either<
  IError,
  IStudyGroupRequestEntity
>
