import { inject, injectable } from 'inversify'
import { InputFindAllTutorings } from '@controller/serializers/tutoring/findAll'
import { IOutputFindAllTutoringsDto } from '@business/dto/tutoring/findAll'
import { FindAllTutoringsUseCase } from '@business/useCases/tutoring/findAllTutoring'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllTutoringsOperator extends AbstractOperator<
  InputFindAllTutorings,
  IOutputFindAllTutoringsDto
> {
  constructor(
    @inject(FindAllTutoringsUseCase)
    private findAllTutorings: FindAllTutoringsUseCase
  ) {
    super()
  }

  async run(input: InputFindAllTutorings): Promise<IOutputFindAllTutoringsDto> {
    this.exec(input)

    const tutorings = await this.findAllTutorings.exec({
      pagination: { count: input.count, page: input.page },
      filters: {
        contains: input.contains,
      },
    })

    if (tutorings.isLeft()) {
      return left(tutorings.value)
    }

    return tutorings
  }
}
