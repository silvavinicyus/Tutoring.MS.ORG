import { inject, injectable } from 'inversify'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IInputDeleteUserDto,
  IOutputDeleteUserDto,
} from '@business/dto/user/delete'
import {
  IUserRepository,
  IUserRepositoryToken,
} from '@business/repositories/user/iUserRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { UserErrors } from '@business/module/errors/userErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteUserUseCase
  implements IAbstractUseCase<IInputDeleteUserDto, IOutputDeleteUserDto>
{
  constructor(
    @inject(IUserRepositoryToken)
    private userRepository: IUserRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeleteUserDto,
    trx?: ITransaction
  ): Promise<IOutputDeleteUserDto> {
    try {
      const userResult = await this.userRepository.delete(props, trx)

      return right(userResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(UserErrors.deleteFailed())
    }
  }
}
