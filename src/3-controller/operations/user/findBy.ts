import { inject, injectable } from 'inversify'
import { InputFindUserBy } from '@controller/serializers/user/findBy'
import { IOutputFindUserByDto } from '@business/dto/user/findBy'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindUserByOperator extends AbstractOperator<
  InputFindUserBy,
  IOutputFindUserByDto
> {
  constructor(
    @inject(FindByUserUseCase)
    private findByUser: FindByUserUseCase
  ) {
    super()
  }

  async run(input: InputFindUserBy): Promise<IOutputFindUserByDto> {
    this.exec(input)

    const user = await this.findByUser.exec({
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

    return user
  }
}
