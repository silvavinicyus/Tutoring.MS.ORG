import { IError } from '@shared/IError'

export class RolesErrors extends IError {
  static notAllowed(): IError {
    return new RolesErrors({
      statusCode: 401,
      body: {
        code: 'RE-401',
        message: 'Your role doesn`t have access to this functionality',
        shortMessage: 'roleNotAllowed',
      },
    })
  }
}
