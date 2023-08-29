import { IUserEntity, IInputUserEntity } from '@domain/entities/user'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'

export type IInputCreateUserDto = IInputUserEntity
export type IOutputCreateUserDto = Either<IError, IUserEntity>
