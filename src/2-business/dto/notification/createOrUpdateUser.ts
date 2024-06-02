import { IUserEntity } from '@domain/entities/user'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateOrUpdateUserNotificationDto = {
  user?: Pick<
    IUserEntity,
    'name' | 'phone' | 'email' | 'id' | 'birthdate' | 'uuid'
  > & {
    password?: string
  }
  deleted?: boolean
}

export type IOutputCreateOrUpdateUserNotificationDto = Either<IError, void>
