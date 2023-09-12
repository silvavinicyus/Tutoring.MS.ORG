import { inject, injectable } from 'inversify'
import {
  IInputFindByStudyGroupLeaderDto,
  IOutputFindByStudyGroupLeaderDto,
} from '@business/dto/studyGroupLeader/findBy'
import {
  IStudyGroupLeaderRepository,
  IStudyGroupLeaderRepositoryToken,
} from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindByStudyGroupLeaderUseCase
  implements
    IAbstractUseCase<
      IInputFindByStudyGroupLeaderDto,
      IOutputFindByStudyGroupLeaderDto
    >
{
  constructor(
    @inject(IStudyGroupLeaderRepositoryToken)
    private studyGroupLeaderRepository: IStudyGroupLeaderRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindByStudyGroupLeaderDto
  ): Promise<IOutputFindByStudyGroupLeaderDto> {
    try {
      const studyGroupLeader = await this.studyGroupLeaderRepository.findBy(
        props
      )

      if (!studyGroupLeader) {
        return left(StudyGroupLeaderErrors.notFound())
      }

      return right(studyGroupLeader)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupLeaderErrors.loadFailed())
    }
  }
}
