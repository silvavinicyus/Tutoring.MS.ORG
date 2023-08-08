import { IError } from '@shared/IError'

export class FooErrors extends IError {
  static creationError(): IError {
    return new FooErrors({
      statusCode: 500,
      body: {
        code: 'BB-101',
        message: 'Error on Foo`s creation',
        shortMessage: 'FooCreationFailed',
      },
    })
  }
  
  static updateError(): IError {
    return new FooErrors({
      statusCode: 500,
      body: {
        code: 'BB-201',
        message: 'Error on Foo`s update',
        shortMessage: 'FooUpdateFailed',
      },
    })
  }

  static notFound(): IError {
    return new FooErrors({
      statusCode: 404,
      body: {
        code: 'BB-302',
        message: 'Foo not found',
        shortMessage: 'FooNotFound',
      },
    })
  }

  static databaseConn(): IError {
    return new FooErrors({
      statusCode: 500,
      body: {
        code: 'BB-501',
        message: 'An internal error in connection with Foo database',
        shortMessage: 'DatabaseConnectionFailed',
      },
    })
  }

  static loadFailed(): IError {
    return new FooErrors({
      statusCode: 500,
      body: {
        code: 'BB-301',
        message: 'It wasn`t possible to load',
        shortMessage: 'FoosLoadFailed',
      },
    })
  }
}
