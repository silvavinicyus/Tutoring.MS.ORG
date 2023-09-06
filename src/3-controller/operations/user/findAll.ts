import { inject, injectable } from 'inversify'
import { InputFindAllUsers } from '@controller/serializers/user/findAll'
import { IOutputFindAllUsersDto } from '@business/dto/user/findAll'
import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsers'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllUsersOperator extends AbstractOperator<
  InputFindAllUsers,
  IOutputFindAllUsersDto
> {
  constructor(
    @inject(FindAllUsersUseCase)
    private findAllUsers: FindAllUsersUseCase
  ) {
    super()
  }

  async run(input: InputFindAllUsers): Promise<IOutputFindAllUsersDto> {
    this.exec(input)
    const users = await this.findAllUsers.exec({
      pagination: { count: input.count, page: input.page },
      filters: {
        contains: input.contains,
      },
    })

    if (users.isLeft()) {
      return left(users.value)
    }

    return users
  }
}
