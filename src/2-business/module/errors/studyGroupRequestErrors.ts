import { IError } from '@shared/IError'

export class StudyGroupRequestErrors extends IError {
  static creationError(): IError {
    return new StudyGroupRequestErrors({
      statusCode: 500,
      body: {
        code: 'SGR-101',
        message: 'Error on Study Group Request creation',
        shortMessage: 'StudyGroupRequestCreationFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new StudyGroupRequestErrors({
      statusCode: 500,
      body: {
        code: 'SGR-102',
        message: 'It wasn`t possible to delete',
        shortMessage: 'StudyGroupRequestDeleteFailed',
      },
    })
  }

  static loadFailed(): IError {
    return new StudyGroupRequestErrors({
      statusCode: 500,
      body: {
        code: 'SGR-103',
        message: 'It wasn`t possible to load',
        shortMessage: 'StudyGroupRequestLoadFailed',
      },
    })
  }

  static notFound(): IError {
    return new StudyGroupRequestErrors({
      statusCode: 404,
      body: {
        code: 'SGR-104',
        message: 'Study group request not found',
        shortMessage: 'StudyGroupRequestNotFound',
      },
    })
  }

  static alreadyInGroup(): IError {
    return new StudyGroupRequestErrors({
      statusCode: 400,
      body: {
        code: 'SGR-105',
        message: 'You are already in this study group',
        shortMessage: 'alreadyInGroup',
      },
    })
  }
}
