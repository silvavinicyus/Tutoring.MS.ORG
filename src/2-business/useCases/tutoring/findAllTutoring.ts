import { inject, injectable } from 'inversify'
import {
  IInputFindAllTutoringsDto,
  IOutputFindAllTutoringsDto,
} from '@business/dto/tutoring/findAll'
import {
  ITutoringRepository,
  ITutoringRepositoryToken,
} from '@business/repositories/tutoring/iTutoringRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllTutoringsUseCase
  implements
    IAbstractUseCase<IInputFindAllTutoringsDto, IOutputFindAllTutoringsDto>
{
  constructor(
    @inject(ITutoringRepositoryToken)
    private tutoringRepository: ITutoringRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindAllTutoringsDto
  ): Promise<IOutputFindAllTutoringsDto> {
    try {
      const tutorings = await this.tutoringRepository.findAll(props)

      return right(tutorings)
    } catch (err) {
      this.loggerService.error(err)
      return left(TutoringErrors.loadFailed())
    }
  }
}
