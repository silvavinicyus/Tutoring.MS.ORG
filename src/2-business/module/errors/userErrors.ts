import { IError } from '@shared/IError'

export class UserErrors extends IError {
  static creationError(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'BB-101',
        message: 'Error on User`s creation',
        shortMessage: 'UserCreationFailed',
      },
    })
  }

  static updateError(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'BB-201',
        message: 'Error on User`s update',
        shortMessage: 'UserUpdateFailed',
      },
    })
  }

  static notFound(): IError {
    return new UserErrors({
      statusCode: 404,
      body: {
        code: 'BB-302',
        message: 'User not found',
        shortMessage: 'UserNotFound',
      },
    })
  }

  static databaseConn(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'BB-501',
        message: 'An internal error in connection with User database',
        shortMessage: 'DatabaseConnectionFailed',
      },
    })
  }

  static loadFailed(): IError {
    return new UserErrors({
      statusCode: 500,
      body: {
        code: 'BB-301',
        message: 'It wasn`t possible to load',
        shortMessage: 'UsersLoadFailed',
      },
    })
  }
}
