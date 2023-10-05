import { injectable } from 'inversify'
import { IFileRepository } from '@business/repositories/file/iFileRepository'
import { IInputDeleteFileDto } from '@business/dto/file/delete'
import { IInputFindByFileDto } from '@business/dto/file/findBy'
import { IFileEntity } from '@domain/entities/file'
import { FileModel } from '@framework/models/file'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class FileRepository implements IFileRepository {
  async create(input: IFileEntity, trx?: ITransaction): Promise<IFileEntity> {
    const file = await FileModel.create(input, {
      transaction: trx,
    })

    return file.get({
      plain: true,
    })
  }

  async findBy(input: IInputFindByFileDto): Promise<IFileEntity> {
    const options = createFindAllOptions(input)

    const file = await FileModel.findOne(options)

    if (!file) {
      return void 0
    }

    return file.get({ plain: true })
  }

  async delete(input: IInputDeleteFileDto, trx?: ITransaction): Promise<void> {
    await FileModel.destroy({
      where: {
        id: input.id,
      },
      transaction: trx,
    })

    return void 0
  }
}
