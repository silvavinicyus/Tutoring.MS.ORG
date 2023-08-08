import { IError } from '@shared/IError'

export class TransactionErrors extends IError {
  static creationError(): IError {
    return new TransactionErrors({
      statusCode: 500,
      body: {
        code: 'TE-101',
        message:
          'Error during creation of the transaction entity, please try again later',
        shortMessage: 'transactionCreationFailed',
      },
    })
  }
}
