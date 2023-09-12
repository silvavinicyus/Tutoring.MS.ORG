import { inject, injectable } from 'inversify'
import {
  IInputFindAllStudyGroupLeadersDto,
  IOutputFindAllStudyGroupLeadersDto,
} from '@business/dto/studyGroupLeader/findAll'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IStudyGroupLeaderRepository,
  IStudyGroupLeaderRepositoryToken,
} from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import { left, right } from '@shared/either'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllStudyGroupLeadersUseCase
  implements
    IAbstractUseCase<
      IInputFindAllStudyGroupLeadersDto,
      IOutputFindAllStudyGroupLeadersDto
    >
{
  constructor(
    @inject(IStudyGroupLeaderRepositoryToken)
    private studyGroupLeaderRepository: IStudyGroupLeaderRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindAllStudyGroupLeadersDto
  ): Promise<IOutputFindAllStudyGroupLeadersDto> {
    try {
      const studyGroupLeaders = await this.studyGroupLeaderRepository.findAll(
        props
      )

      return right(studyGroupLeaders)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupLeaderErrors.loadFailed())
    }
  }
}
