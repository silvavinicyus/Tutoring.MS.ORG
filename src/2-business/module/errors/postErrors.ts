import { IError } from '@shared/IError'

export class PostErrors extends IError {
  static creationError(): IError {
    return new PostErrors({
      statusCode: 500,
      body: {
        code: 'PST-101',
        message: 'Error on Post`s creation',
        shortMessage: 'PostCreationFailed',
      },
    })
  }

  static updateError(): IError {
    return new PostErrors({
      statusCode: 500,
      body: {
        code: 'PST-102',
        message: 'Error on Post`s update',
        shortMessage: 'PostUpdateFailed',
      },
    })
  }

  static notFound(): IError {
    return new PostErrors({
      statusCode: 404,
      body: {
        code: 'PST-103',
        message: 'Post not found',
        shortMessage: 'PostNotFound',
      },
    })
  }

  static databaseConn(): IError {
    return new PostErrors({
      statusCode: 500,
      body: {
        code: 'PST-104',
        message: 'An internal error in connection with Post database',
        shortMessage: 'DatabaseConnectionFailed',
      },
    })
  }

  static loadFailed(): IError {
    return new PostErrors({
      statusCode: 500,
      body: {
        code: 'PST-105',
        message: 'It wasn`t possible to load',
        shortMessage: 'PostsLoadFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new PostErrors({
      statusCode: 500,
      body: {
        code: 'PST-106',
        message: 'It wasn`t possible to delete',
        shortMessage: 'PostDeleteFailed',
      },
    })
  }
}
