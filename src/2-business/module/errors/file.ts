import { IError } from '@shared/IError'

export class FileErrors extends IError {
  static creationError(): IError {
    return new FileErrors({
      statusCode: 500,
      body: {
        code: 'FL-101',
        message: 'Error on File`s creation',
        shortMessage: 'FileCreationFailed',
      },
    })
  }

  static notFound(): IError {
    return new FileErrors({
      statusCode: 404,
      body: {
        code: 'FL-103',
        message: 'File not found',
        shortMessage: 'FileNotFound',
      },
    })
  }

  static loadFailed(): IError {
    return new FileErrors({
      statusCode: 500,
      body: {
        code: 'FL-105',
        message: 'It wasn`t possible to load',
        shortMessage: 'FilesLoadFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new FileErrors({
      statusCode: 500,
      body: {
        code: 'FL-106',
        message: 'It wasn`t possible to delete',
        shortMessage: 'FileDeleteFailed',
      },
    })
  }
}
