import { inject, injectable } from 'inversify'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IInputUpdateUserDto,
  IOutputUpdateUserDto,
} from '@business/dto/user/update'
import { UserErrors } from '@business/module/errors/userErrors'
import {
  IUserRepository,
  IUserRepositoryToken,
  updateWhereUser,
} from '@business/repositories/user/iUserRepository'
import { UserEntity } from '@domain/entities/user'
import { left, right } from '@shared/either'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class UpdateUserUseCase
  implements IAbstractUseCase<IInputUpdateUserDto, IOutputUpdateUserDto>
{
  constructor(
    @inject(IUserRepositoryToken)
    private userRepository: IUserRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputUpdateUserDto,
    updateWhere: updateWhereUser,
    trx?: ITransaction
  ): Promise<IOutputUpdateUserDto> {
    try {
      const userEntity = UserEntity.update(props, new Date())

      const user = await this.userRepository.update(
        {
          newData: userEntity.value.export(),
          updateWhere,
        },
        trx
      )

      if (!user) {
        return left(UserErrors.updateError())
      }

      return right(user)
    } catch (err) {
      this.loggerService.error(err)
      return left(UserErrors.updateError())
    }
  }
}
