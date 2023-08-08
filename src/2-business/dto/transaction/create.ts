import { ICreateTransaction } from '@business/repositories/transaction/iTransactionRepository'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'
import { IUseCaseOptions } from '../useCaseOptions'

export type IOutputCreateTransactionDto = Either<IError, ICreateTransaction>

export type ITransaction = IUseCaseOptions['transaction']
