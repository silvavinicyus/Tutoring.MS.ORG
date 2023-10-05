import { IWhere } from '@business/repositories/where'
import { IFileEntity } from '@domain/entities/file'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'
import { IUseCaseOptions } from '../useCaseOptions'

export interface IInputFindByFileDto
  extends IUseCaseOptions<keyof IFileEntity, string | number> {
  where: IWhere<keyof IFileEntity, string | number>[]
}

export type IOutputFindByFileDto = Either<IError, IFileEntity>
