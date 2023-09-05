import { inject, injectable } from 'inversify'
import { IOutputDeleteUserDto } from '@business/dto/user/delete'
import { InputDeleteUser } from '@controller/serializers/user/delete'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUser'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteUserOperator extends AbstractOperator<
  InputDeleteUser,
  IOutputDeleteUserDto
> {
  constructor(
    @inject(DeleteUserUseCase)
    private deleteUser: DeleteUserUseCase,
    @inject(FindByUserUseCase)
    private findUser: FindByUserUseCase
  ) {
    super()
  }

  async run(input: InputDeleteUser): Promise<IOutputDeleteUserDto> {
    this.exec(input)

    const user = await this.findUser.exec({
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

    const userResult = await this.deleteUser.exec({
      id: user.value.id,
    })

    if (userResult.value) {
      return left(userResult.value)
    }

    return userResult
  }
}
