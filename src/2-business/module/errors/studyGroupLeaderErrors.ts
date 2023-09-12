import { IError } from '@shared/IError'

export class StudyGroupLeaderErrors extends IError {
  static creationError(): IError {
    return new StudyGroupLeaderErrors({
      statusCode: 500,
      body: {
        code: 'SGLL-101',
        message: 'Error on Study Group Leader creation',
        shortMessage: 'StudyGroupLeaderCreationFailed',
      },
    })
  }

  static notFound(): IError {
    return new StudyGroupLeaderErrors({
      statusCode: 404,
      body: {
        code: 'SGL-103',
        message: 'Study Group Leader not found',
        shortMessage: 'StudyGroupLeaderNotFound',
      },
    })
  }

  static loadFailed(): IError {
    return new StudyGroupLeaderErrors({
      statusCode: 500,
      body: {
        code: 'SGL-105',
        message: 'It wasn`t possible to load',
        shortMessage: 'StudyGroupLeadersLoadFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new StudyGroupLeaderErrors({
      statusCode: 500,
      body: {
        code: 'SGL-106',
        message: 'It wasn`t possible to delete',
        shortMessage: 'StudyGroupLeaderDeleteFailed',
      },
    })
  }

  static alreadyExists(): IError {
    return new StudyGroupLeaderErrors({
      statusCode: 500,
      body: {
        code: 'SGL-107',
        message: 'This leader already exists in this study group',
        shortMessage: 'StudyGroupLeaderAlreadyExists',
      },
    })
  }
}
