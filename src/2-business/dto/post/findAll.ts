import { IPostEntity, PostEntityKeys } from '@domain/entities/post'
import { IWhere } from '@business/repositories/where'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'
import { IPaginatedResponse, IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindAllPostsDto
  extends IUseCaseOptions<keyof PostEntityKeys, string | number> {
  where?: IWhere<keyof PostEntityKeys, string | number>[]
}

export type IOutputFindAllPostsDto = Either<
  IError,
  IPaginatedResponse<IPostEntity>
>
