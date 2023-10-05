import { IInputDeleteFileDto } from '@business/dto/file/delete'
import { IInputFindByFileDto } from '@business/dto/file/findBy'
import { ITransaction } from '@business/dto/transaction/create'
import { IFileEntity } from '@domain/entities/file'

export const IFileRepositoryToken = Symbol.for('FileRepositorySymbol')

export interface IFileRepository {
  create(input: IFileEntity, trx?: ITransaction): Promise<IFileEntity>
  findBy(input: IInputFindByFileDto): Promise<IFileEntity>
  delete(input: IInputDeleteFileDto, trx?: ITransaction): Promise<void>
}
