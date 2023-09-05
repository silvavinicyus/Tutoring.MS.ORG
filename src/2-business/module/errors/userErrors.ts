import { IError } from '@shared/IError'

export class UserErrors extends IError {
  static creationError(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'US-101',
        message: 'Error on User`s creation',
        shortMessage: 'UserCreationFailed',
      },
    })
  }

  static updateError(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'US-102',
        message: 'Error on User`s update',
        shortMessage: 'UserUpdateFailed',
      },
    })
  }

  static notFound(): IError {
    return new UserErrors({
      statusCode: 404,
      body: {
        code: 'US-103',
        message: 'User not found',
        shortMessage: 'UserNotFound',
      },
    })
  }

  static databaseConn(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'US-104',
        message: 'An internal error in connection with User database',
        shortMessage: 'DatabaseConnectionFailed',
      },
    })
  }

  static loadFailed(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'US-105',
        message: 'It wasn`t possible to load',
        shortMessage: 'UsersLoadFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'US-106',
        message: 'It wasn`t possible to delete',
        shortMessage: 'UserDeleteFailed',
      },
    })
  }
}
