import { IFile } from '@business/services/s3Storage/iS3Storage'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputSavePrivateFileDto = {
  file: IFile
  key: string
}

export type IOutputSavePrivateFileDto = Either<IError, void>
