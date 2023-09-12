import { IWhere } from '@business/repositories/where'
import {
  IPostReactionEntity,
  PostReactionEntityKeys,
} from '@domain/entities/postReactions'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindByPostReactionDto
  extends IUseCaseOptions<keyof PostReactionEntityKeys, string | number> {
  where: IWhere<keyof PostReactionEntityKeys, string | number>[]
}

export type IOutputFindByPostReactionDto = Either<IError, IPostReactionEntity>
