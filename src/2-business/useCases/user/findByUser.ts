import { inject, injectable } from 'inversify'
import {
  IInputFindUserByDto,
  IOutputFindUserByDto,
} from '@business/dto/user/findBy'
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
export class FindByUserUseCase
  implements IAbstractUseCase<IInputFindUserByDto, IOutputFindUserByDto>
{
  constructor(
    @inject(IUserRepositoryToken)
    private userRepository: IUserRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(props: IInputFindUserByDto): Promise<IOutputFindUserByDto> {
    try {
      const user = await this.userRepository.findBy(props)

      return right(user)
    } catch (err) {
      this.loggerService.error(err)
      return left(UserErrors.loadFailed())
    }
  }
}
