import { inject, injectable } from 'inversify'
import {
  IInputFindAllUsersDto,
  IOutputFindAllUsersDto,
} from '@business/dto/user/findAll'
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
export class FindAllUsersUseCase
  implements IAbstractUseCase<IInputFindAllUsersDto, IOutputFindAllUsersDto>
{
  constructor(
    @inject(IUserRepositoryToken)
    private userRepository: IUserRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(props: IInputFindAllUsersDto): Promise<IOutputFindAllUsersDto> {
    try {
      const users = await this.userRepository.findAll(props)

      return right(users)
    } catch (err) {
      this.loggerService.error(err)
      return left(UserErrors.loadFailed())
    }
  }
}
