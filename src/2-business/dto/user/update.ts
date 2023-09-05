import { IUserEntity } from '@domain/entities/user'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputUpdateUserDto = Partial<
  Omit<IUserEntity, 'id' | 'uuid' | 'created_at' | 'updated_at'>
>

export type IOutputUpdateUserDto = Either<IError, Partial<IUserEntity>>
