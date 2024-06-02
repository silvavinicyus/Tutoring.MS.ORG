import { IError } from '@shared/IError'

export class NotificationErrors extends IError {
  static createOrUpdateUserFailed(): IError {
    return new NotificationErrors({
      statusCode: 500,
      body: {
        code: 'NTF-101',
        message: 'Error while sending create or update user notification',
        shortMessage: 'CreateOrUpdateUserFailed',
      },
    })
  }

  static createOrUpdateTutoringFailed(): IError {
    return new NotificationErrors({
      statusCode: 500,
      body: {
        code: 'NTF-102',
        message: 'Error while sending create or update tutoring notification',
        shortMessage: 'createOrUpdateTutoringFailed',
      },
    })
  }

  static createOrUpdateStudyGroupFailed(): IError {
    return new NotificationErrors({
      statusCode: 500,
      body: {
        code: 'NTF-102',
        message:
          'Error while sending create or update study group notification',
        shortMessage: 'createOrUpdateStudyGroupFailed',
      },
    })
  }
}
