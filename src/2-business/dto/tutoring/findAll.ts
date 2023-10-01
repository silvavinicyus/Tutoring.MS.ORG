import { ITutoringEntity, TutoringEntityKeys } from '@domain/entities/tutoring'
import { IWhere } from '@business/repositories/where'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'
import { IPaginatedResponse, IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindAllTutoringsDto
  extends IUseCaseOptions<keyof TutoringEntityKeys, string | number> {
  where?: IWhere<keyof TutoringEntityKeys, string | number>[]
}

export type IOutputFindAllTutoringsDto = Either<
  IError,
  IPaginatedResponse<ITutoringEntity>
>
