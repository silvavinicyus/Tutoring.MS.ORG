import { IUserEntity } from '@domain/entities/user'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateUserNotificationDto = Pick<
  IUserEntity,
  'name' | 'phone' | 'email' | 'id' | 'birthdate' | 'uuid'
> & {
  password: string
}

export type IOutputCreateUserNotificationDto = Either<IError, void>
