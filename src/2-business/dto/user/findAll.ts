import { IUserEntity, UserEntityKeys } from '@domain/entities/user'
import { IWhere } from '@business/repositories/where'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'
import { IPaginatedResponse, IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindAllUsersDto
  extends IUseCaseOptions<keyof UserEntityKeys> {
  where?: IWhere<keyof UserEntityKeys, string | number>[]
}

export type IOutputFindAllUsersDto = Either<
  IError,
  IPaginatedResponse<IUserEntity>
>
