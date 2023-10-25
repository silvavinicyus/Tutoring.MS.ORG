import { Either } from '@shared/either'
import { IError } from '@shared/IError'

export interface IAuthorizerInformation {
  email: string
  name: string
  phone: string
  user_real_id: number
  user_real_uuid: string
  role?: string
  permissions: string
  birthdate: string
}

export interface IInputAuthorizeUseCase {
  permissions: string[]
  user: IAuthorizerInformation
}

export type IOutputAuthorizeUseCase = Either<IError, IAuthorizerInformation>
