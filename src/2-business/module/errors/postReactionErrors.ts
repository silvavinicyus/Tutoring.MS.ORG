import { IError } from '@shared/IError'

export class PostReactionErrors extends IError {
  static creationError(): IError {
    return new PostReactionErrors({
      statusCode: 500,
      body: {
        code: 'PR-101',
        message: 'Error on Post`s creation',
        shortMessage: 'PostReactionCreationFailed',
      },
    })
  }

  static notFound(): IError {
    return new PostReactionErrors({
      statusCode: 404,
      body: {
        code: 'PR-103',
        message: 'Post reaction not found',
        shortMessage: 'PostReactionNotFound',
      },
    })
  }

  static loadFailed(): IError {
    return new PostReactionErrors({
      statusCode: 500,
      body: {
        code: 'PR-105',
        message: 'It wasn`t possible to load',
        shortMessage: 'PostReactionLoadFailed',
      },
    })
  }

  static deleteFailed(): IError {
    return new PostReactionErrors({
      statusCode: 500,
      body: {
        code: 'PR-106',
        message: 'It wasn`t possible to delete',
        shortMessage: 'PostReactionDeleteFailed',
      },
    })
  }
}
