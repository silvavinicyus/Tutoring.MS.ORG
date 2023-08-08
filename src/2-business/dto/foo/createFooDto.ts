import {
  IFooEntity,
  IInputFooEntity,
} from '@domain/entities/foo'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'

export type IInputCreateFooDto = IInputFooEntity
export type IOutputCreateFooDto = Either<IError, IFooEntity>
