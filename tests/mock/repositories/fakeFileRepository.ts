import { injectable } from 'inversify'
import { IFileRepository } from '@business/repositories/file/iFileRepository'
import { IInputDeleteFileDto } from '@business/dto/file/delete'
import { IInputFindByFileDto } from '@business/dto/file/findBy'
import { IFileEntity } from '@domain/entities/file'

@injectable()
export class FakeFileRepository implements IFileRepository {
  async create(_input: IFileEntity): Promise<IFileEntity> {
    return void 0
  }

  async findBy(_input: IInputFindByFileDto): Promise<IFileEntity> {
    return void 0
  }

  async delete(_input: IInputDeleteFileDto): Promise<void> {
    return void 0
  }
}

export const fakeFileRepositoryDelete = jest.spyOn(
  FakeFileRepository.prototype,
  'delete'
)

export const fakeFileRepositoryCreate = jest.spyOn(
  FakeFileRepository.prototype,
  'create'
)

export const fakeFileRepositoryFindBy = jest.spyOn(
  FakeFileRepository.prototype,
  'findBy'
)
