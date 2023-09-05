import { inject, injectable } from 'inversify'
import { IOutputUpdateUserDto } from '@business/dto/user/update'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { UpdateUserUseCase } from '@business/useCases/user/updateUser'
import { InputUpdateUser } from '@controller/serializers/user/update'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateUserOperator extends AbstractOperator<
  InputUpdateUser,
  IOutputUpdateUserDto
> {
  constructor(
    @inject(UpdateUserUseCase)
    private updateUser: UpdateUserUseCase,
    @inject(FindByUserUseCase)
    private findUserBy: FindByUserUseCase
  ) {
    super()
  }

  async run(input: InputUpdateUser): Promise<IOutputUpdateUserDto> {
    this.exec(input)

    const user = await this.findUserBy.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (user.isLeft()) {
      return left(user.value)
    }

    const userResult = await this.updateUser.exec(
      {
        ...input,
      },
      {
        column: 'uuid',
        value: input.uuid,
      }
    )

    if (userResult.isLeft()) {
      return left(userResult.value)
    }

    return userResult
  }
}
