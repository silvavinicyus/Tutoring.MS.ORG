import { IFooRepository } from '@business/repositories/foo/iFooRepository'
import {
  ILoggerService,
  ILoggerServiceToken
} from '@business/services/logger/iLogger'
import { IFooEntity } from '@domain/entities/foo'
import { Either } from '@shared/either'
import { IError } from '@shared/IError'
import { inject, injectable } from 'inversify'
import { ITransaction } from './transaction'

@injectable()
export class FooRepositorySequelize implements IFooRepository {
  constructor(
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async create(input: IFooEntity, trx?: ITransaction): Promise<Either<IError, IFooEntity>> {
    throw new Error('Method not implemented.')
  }
}
