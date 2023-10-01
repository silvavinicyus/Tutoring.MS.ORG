import { IWhere } from '@business/repositories/where'
import { ITutoringEntity, TutoringEntityKeys } from '@domain/entities/tutoring'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindByTutoringDto
  extends IUseCaseOptions<keyof TutoringEntityKeys, string | number> {
  where: IWhere<keyof TutoringEntityKeys, string | number>[]
}

export type IOutputFindByTutoringDto = Either<IError, ITutoringEntity>
