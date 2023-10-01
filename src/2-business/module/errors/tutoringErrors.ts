import { IError } from '@shared/IError'

export class TutoringErrors extends IError {
  static creationError(): IError {
    return new TutoringErrors({
      statusCode: 500,
      body: {
        code: 'PST-101',
        message: 'Error on Tutoring`s creation',
        shortMessage: 'TutoringCreationFailed',
      },
    })
  }

  static updateError(): IError {
    return new TutoringErrors({
      statusCode: 500,
      body: {
        code: 'PST-102',
        message: 'Error on Tutoring`s update',
        shortMessage: 'TutoringUpdateFailed',
      },
    })
  }

  static notFound(): IError {
    return new TutoringErrors({
      statusCode: 404,
      body: {
        code: 'PST-103',
        message: 'Tutoring not found',
        shortMessage: 'TutoringNotFound',
      },
    })
  }

  static databaseConn(): IError {
    return new TutoringErrors({
      statusCode: 500,
      body: {
        code: 'PST-104',
        message: 'An internal error in connection with Tutoring database',
        shortMessage: 'DatabaseConnectionFailed',
      },
    })
  }

  static loadFailed(): IError {
    return new TutoringErrors({
      statusCode: 500,
      body: {
        code: 'PST-105',
        message: 'It wasn`t possible to load',
        shortMessage: 'TutoringsLoadFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new TutoringErrors({
      statusCode: 500,
      body: {
        code: 'PST-106',
        message: 'It wasn`t possible to delete',
        shortMessage: 'TutoringDeleteFailed',
      },
    })
  }
}
