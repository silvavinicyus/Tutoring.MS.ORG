import { inject, injectable } from 'inversify'
import {
  IInputFindStudyGroupByDto,
  IOutputFindStudyGroupByDto,
} from '@business/dto/studyGroup/findBy'
import {
  IStudyGroupRepository,
  IStudyGroupRepositoryToken,
} from '@business/repositories/studyGroup/iStudyGroupRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindStudyGroupByUseCase
  implements
    IAbstractUseCase<IInputFindStudyGroupByDto, IOutputFindStudyGroupByDto>
{
  constructor(
    @inject(IStudyGroupRepositoryToken)
    private studyGroupRepository: IStudyGroupRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindStudyGroupByDto
  ): Promise<IOutputFindStudyGroupByDto> {
    try {
      const studyGroup = await this.studyGroupRepository.findBy(props)

      if (!studyGroup) {
        return left(StudyGroupErrors.notFound())
      }

      return right(studyGroup)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupErrors.loadFailed())
    }
  }
}
