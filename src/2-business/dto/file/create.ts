import { IFileEntity, IInputFileEntity } from '@domain/entities/file'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateFileDto = IInputFileEntity

export type IOutputCreateFileDto = Either<IError, IFileEntity>
