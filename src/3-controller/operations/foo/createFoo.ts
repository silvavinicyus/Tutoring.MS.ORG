import { IOutputCreateFooDto } from '@business/dto/foo/createFooDto'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { CreateFooUseCase } from '@business/useCases/foo/createFoo'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { InputCreateFoo } from '@controller/serializers/foo/createFoo'
import { left } from '@shared/either'
import { inject } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

export class CreateFooOperator extends AbstractOperator<
  InputCreateFoo,
  IOutputCreateFooDto
> {
  constructor(
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase,
    @inject(CreateFooUseCase)
    private createFoo: CreateFooUseCase
  ) {
    super()
  }
  async run(
    input: InputCreateFoo,
    _authorizer: IAuthorizerInformation
  ): Promise<IOutputCreateFooDto> {
    this.exec(input)
    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }
    const fooResult = await this.createFoo.exec(
      {
        ...input,
      },
      transaction.value.trx
    )
    if (fooResult.isLeft()) {
      await transaction.value.rollback()
      return left(fooResult.value)
    }

    await transaction.value.commit()
    return fooResult
  }
}
