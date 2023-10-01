import {
  IInputTutoringEntity,
  ITutoringEntity,
} from '@domain/entities/tutoring'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateTutoringDto = IInputTutoringEntity

export type IOutputCreateTutoringDto = Either<IError, ITutoringEntity>
