import { IError } from '@shared/IError'

export class StudyGroupErrors extends IError {
  static creationError(): IError {
    return new StudyGroupErrors({
      statusCode: 500,
      body: {
        code: 'SG-101',
        message: 'Error on Study Group`s creation',
        shortMessage: 'StudyGroupCreationFailed',
      },
    })
  }

  static updateError(): IError {
    return new StudyGroupErrors({
      statusCode: 500,
      body: {
        code: 'SG-102',
        message: 'Error on Study Group`s update',
        shortMessage: 'StudyGroupUpdateFailed',
      },
    })
  }

  static notFound(): IError {
    return new StudyGroupErrors({
      statusCode: 404,
      body: {
        code: 'SG-103',
        message: 'Study Group not found',
        shortMessage: 'StudyGroupNotFound',
      },
    })
  }

  static databaseConn(): IError {
    return new StudyGroupErrors({
      statusCode: 500,
      body: {
        code: 'SG-104',
        message: 'An internal error in connection with StudyGroup database',
        shortMessage: 'DatabaseConnectionFailed',
      },
    })
  }

  static loadFailed(): IError {
    return new StudyGroupErrors({
      statusCode: 500,
      body: {
        code: 'SG-105',
        message: 'It wasn`t possible to load',
        shortMessage: 'StudyGroupsLoadFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new StudyGroupErrors({
      statusCode: 500,
      body: {
        code: 'SG-106',
        message: 'It wasn`t possible to delete',
        shortMessage: 'StudyGroupDeleteFailed',
      },
    })
  }
}
