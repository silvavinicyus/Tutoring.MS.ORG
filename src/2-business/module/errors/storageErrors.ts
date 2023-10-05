import { IError } from '@shared/IError'

export class StorageErrors extends IError {
  static failedToSavePrivateFile(): IError {
    return new StorageErrors({
      statusCode: 500,
      body: {
        code: 'STR-301',
        message: 'There was a fail while saving this file',
        shortMessage: 'failedToSavePrivateFile',
      },
    })
  }

  static failedToDeletePrivateFile(): IError {
    return new StorageErrors({
      statusCode: 500,
      body: {
        code: 'STR-302',
        message: 'There was a fail while deleting this file',
        shortMessage: 'failedToDeletePrivateFile',
      },
    })
  }
}
