import {
  IPostReactionEntity,
  PostReactionEntityKeys,
} from '@domain/entities/postReactions'
import { IWhere } from '@business/repositories/where'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'
import { IPaginatedResponse, IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindAllPostReactionsDto
  extends IUseCaseOptions<keyof PostReactionEntityKeys, string | number> {
  where?: IWhere<keyof PostReactionEntityKeys, string | number>[]
}

export type IOutputFindAllPostReactionsDto = Either<
  IError,
  IPaginatedResponse<IPostReactionEntity>
>
