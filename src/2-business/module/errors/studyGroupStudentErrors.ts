import { IError } from '@shared/IError'

export class StudyGroupStudentErrors extends IError {
  static creationError(): IError {
    return new StudyGroupStudentErrors({
      statusCode: 500,
      body: {
        code: 'SGLL-101',
        message: 'Error on Study Group Student creation',
        shortMessage: 'StudyGroupStudentCreationFailed',
      },
    })
  }

  static notFound(): IError {
    return new StudyGroupStudentErrors({
      statusCode: 404,
      body: {
        code: 'SGL-103',
        message: 'Study Group Student not found',
        shortMessage: 'StudyGroupStudentNotFound',
      },
    })
  }

  static loadFailed(): IError {
    return new StudyGroupStudentErrors({
      statusCode: 500,
      body: {
        code: 'SGL-105',
        message: 'It wasn`t possible to load',
        shortMessage: 'StudyGroupStudentsLoadFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new StudyGroupStudentErrors({
      statusCode: 500,
      body: {
        code: 'SGL-106',
        message: 'It wasn`t possible to delete',
        shortMessage: 'StudyGroupStudentDeleteFailed',
      },
    })
  }

  static alreadyExists(): IError {
    return new StudyGroupStudentErrors({
      statusCode: 500,
      body: {
        code: 'SGL-107',
        message: 'This student already exists in this study group',
        shortMessage: 'StudyGroupStudentAlreadyExists',
      },
    })
  }
}
