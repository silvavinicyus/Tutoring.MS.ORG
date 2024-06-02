import { injectable } from 'inversify'
import {
  IFile,
  IS3StorageService,
} from '@business/services/s3Storage/iS3Storage'

@injectable()
export class FakeStorageService implements IS3StorageService {
  async save(_file: IFile, _key: string): Promise<void> {
    return void 0
  }
  async delete(_key: string): Promise<void> {
    return void 0
  }
  async savePrivateFile(_file: IFile, _key: string): Promise<void> {
    return void 0
  }
  async deletePrivateFile(_key: string): Promise<void> {
    return void 0
  }
}

export const fakeStorageServiceDeletePrivateFile = jest.spyOn(
  FakeStorageService.prototype,
  'deletePrivateFile'
)

export const fakeStorageServiceDelete = jest.spyOn(
  FakeStorageService.prototype,
  'delete'
)

export const fakeStorageServiceSave = jest.spyOn(
  FakeStorageService.prototype,
  'save'
)

export const fakeStorageServiceSavePrivateFile = jest.spyOn(
  FakeStorageService.prototype,
  'savePrivateFile'
)
