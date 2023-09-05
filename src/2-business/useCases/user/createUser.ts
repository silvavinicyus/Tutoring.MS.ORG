import { inject, injectable } from 'inversify'
import { UserEntity } from '@domain/entities/user'
import {
  IInputCreateUserDto,
  IOutputCreateUserDto,
} from '@business/dto/user/create'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IUserRepository,
  IUserRepositoryToken,
} from '@business/repositories/user/iUserRepository'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { UserErrors } from '@business/module/errors/userErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateUserUseCase
  implements IAbstractUseCase<IInputCreateUserDto, IOutputCreateUserDto>
{
  constructor(
    @inject(IUserRepositoryToken)
    private userRepository: IUserRepository,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputCreateUserDto,
    trx?: ITransaction
  ): Promise<IOutputCreateUserDto> {
    try {
      const userEntity = UserEntity.create(props, new Date())
      const userResult = await this.userRepository.create(
        {
          ...userEntity.value.export(),
          uuid: this.uniqueIdentifier.create(),
        },
        trx
      )

      return right(userResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(UserErrors.creationError())
    }
  }
}
