import { IUserEntity, UserEntityKeys } from '@domain/entities/user'
import { IWhere } from '@business/repositories/where'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'
import { IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindUserByDto
  extends IUseCaseOptions<keyof UserEntityKeys> {
  where: IWhere<keyof UserEntityKeys, string | number>[]
}

export type IOutputFindUserByDto = Either<IError, IUserEntity>
