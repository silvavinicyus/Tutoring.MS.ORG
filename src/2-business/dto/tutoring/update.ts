import { ITutoringEntity } from '@domain/entities/tutoring'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputUpdateTutoringDto = Partial<Pick<ITutoringEntity, 'date'>>

export type IOutputUpdateTutoringDto = Either<IError, Partial<ITutoringEntity>>
