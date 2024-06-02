import { IInputDeletePrivateFileDto } from '@business/dto/storage/deletePrivateFile'
import { IInputSavePrivateFileDto } from '@business/dto/storage/savePrivateFile'
import { StorageErrors } from '@business/module/errors/storageErrors'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IS3StorageServiceToken } from '@business/services/s3Storage/iS3Storage'
import { DeletePrivateFileUseCase } from '@business/useCases/storage/deletePrivateFile'
import { SavePrivateFileUseCase } from '@business/useCases/storage/savePrivateFile'
import { container } from '@shared/ioc/container'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import {
  FakeStorageService,
  fakeStorageServiceDeletePrivateFile,
  fakeStorageServiceSavePrivateFile,
} from '@tests/mock/services/fakeStorageService'

describe('Storage Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container.bind(IS3StorageServiceToken).to(FakeStorageService)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Delete Private File Use Case', () => {
    const input: IInputDeletePrivateFileDto = {
      key: 'file_key',
    }

    test('Should fail to delete a private file if service failed', async () => {
      fakeStorageServiceDeletePrivateFile.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeletePrivateFileUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StorageErrors.failedToDeletePrivateFile())
    })

    test('Should have success to delete a private file', async () => {
      fakeStorageServiceDeletePrivateFile.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(DeletePrivateFileUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Save Private File Use Case', () => {
    const input: IInputSavePrivateFileDto = {
      key: 'file_key',
      file: {
        content: Buffer.from('asd'),
        enconding: 'encoding',
        filename: 'filename',
        mimetype: 'mimetype',
        truncated: false,
      },
    }

    test('Should fail to save a private file if service failed', async () => {
      fakeStorageServiceSavePrivateFile.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(SavePrivateFileUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StorageErrors.failedToSavePrivateFile())
    })

    test('Should have success to save a private file', async () => {
      fakeStorageServiceSavePrivateFile.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(SavePrivateFileUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
