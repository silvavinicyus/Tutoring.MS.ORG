import { IWhere } from '@business/repositories/where'
import { IPostEntity, PostEntityKeys } from '@domain/entities/post'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindByPostDto
  extends IUseCaseOptions<keyof PostEntityKeys, string | number> {
  where: IWhere<keyof PostEntityKeys, string | number>[]
}

export type IOutputFindByPostDto = Either<IError, IPostEntity>
