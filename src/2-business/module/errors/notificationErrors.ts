import { IError } from '@shared/IError'

export class NotificationErrors extends IError {
  static createUserFailed(): IError {
    return new NotificationErrors({
      statusCode: 500,
      body: {
        code: 'NTF-101',
        message: 'Error while sending create user notification',
        shortMessage: 'CreateUserFailed',
      },
    })
  }
}
