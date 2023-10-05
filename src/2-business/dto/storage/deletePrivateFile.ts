import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputDeletePrivateFileDto = {
  key: string
}

export type IOutputDeletePrivateFileDto = Either<IError, void>
