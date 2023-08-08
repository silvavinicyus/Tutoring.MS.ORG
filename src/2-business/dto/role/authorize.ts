import { Either } from '@shared/either'
import { IError } from '@shared/IError'

export interface IAuthorizerInformationFormated
  extends Omit<IAuthorizerInformation, 'id' | 'collaborator_id'> {
  id: number
  collaborator_id: number
}

export interface IAuthorizerInformation {
  id: string
  uuid: string
  email: string
  document_type: string
  document_number: string
  role: string
  collaborator_id: string
  collaborator_uuid: string
  collaborator_full_name: string
  created_at: string
}

export interface IInputAuthorizeUseCase {
  authorizerInformation: IAuthorizerInformation
  allowedProfiles: string[]
  lastChance?: (
    user: Required<IAuthorizerInformationFormated>
  ) => Promise<boolean>
}

export type IOutputAuthorizeUseCase = Either<
  IError,
  IAuthorizerInformationFormated
>
