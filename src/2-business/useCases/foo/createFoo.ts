import { IInputCreateFooDto, IOutputCreateFooDto } from '@business/dto/foo/createFooDto'
import { ITransaction } from '@business/dto/transaction/create'
import { IFooRepository, IFooRepositoryToken } from '@business/repositories/foo/iFooRepository'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { FooEntity } from '@domain/entities/foo'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateFooUseCase
  implements
    IAbstractUseCase<IInputCreateFooDto, IOutputCreateFooDto>
{
  constructor(
    @inject(IFooRepositoryToken)
    private fooRepository: IFooRepository,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputCreateFooDto,
    trx?: ITransaction
  ): Promise<IOutputCreateFooDto> {
    const fooEntity = FooEntity.create(props, new Date())
    const fooResult = await this.fooRepository.create(
      {
        ...fooEntity.value.export(),
        uuid: this.uniqueIdentifier.create(),
      },
      trx
    )
    return fooResult
  }
}
