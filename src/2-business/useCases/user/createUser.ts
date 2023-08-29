import { inject, injectable } from 'inversify'
import { UserEntity } from '@domain/entities/user'
import {
  IInputCreateUserDto,
  IOutputCreateUserDto,
} from '@business/dto/user/createUserDto'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IUserRepository,
  IUserRepositoryToken,
} from '@business/repositories/user/iUserRepository'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateUserUseCase
  implements IAbstractUseCase<IInputCreateUserDto, IOutputCreateUserDto>
{
  constructor(
    @inject(IUserRepositoryToken)
    private userRepository: IUserRepository,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputCreateUserDto,
    trx?: ITransaction
  ): Promise<IOutputCreateUserDto> {
    const userEntity = UserEntity.create(props, new Date())
    const userResult = await this.userRepository.create(
      {
        ...userEntity.value.export(),
        uuid: this.uniqueIdentifier.create(),
      },
      trx
    )
    return userResult
  }
}
