import { inject, injectable } from 'inversify'
import {
  IInputFindByTutoringDto,
  IOutputFindByTutoringDto,
} from '@business/dto/tutoring/findBy'
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
export class FindByTutoringUseCase
  implements
    IAbstractUseCase<IInputFindByTutoringDto, IOutputFindByTutoringDto>
{
  constructor(
    @inject(ITutoringRepositoryToken)
    private tutoringRepository: ITutoringRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindByTutoringDto
  ): Promise<IOutputFindByTutoringDto> {
    try {
      const tutoring = await this.tutoringRepository.findBy(props)

      if (!tutoring) {
        return left(TutoringErrors.notFound())
      }

      return right(tutoring)
    } catch (err) {
      this.loggerService.error(err)
      return left(TutoringErrors.loadFailed())
    }
  }
}
