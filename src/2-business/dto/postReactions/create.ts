import {
  IInputPostReactionEntity,
  IPostReactionEntity,
} from '@domain/entities/postReactions'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreatePostReactionDto = IInputPostReactionEntity

export type IOutputCreatePostReactionDto = Either<IError, IPostReactionEntity>
