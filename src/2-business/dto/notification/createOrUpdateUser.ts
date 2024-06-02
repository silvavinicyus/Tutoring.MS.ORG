import { IUserEntity } from '@domain/entities/user'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateOrUpdateUserNotificationDto = {
  user: Partial<
    Pick<IUserEntity, 'name' | 'phone' | 'email' | 'birthdate' | 'uuid'>
  > & {
    password?: string
    id: number
  }
  deleted?: boolean
}

export type IOutputCreateOrUpdateUserNotificationDto = Either<IError, void>
