import { inject, injectable } from 'inversify'
import {
  IInputFindAllStudyGroupsDto,
  IOutputFindAllStudyGroupsDto,
} from '@business/dto/studyGroup/findAll'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import {
  IStudyGroupRepository,
  IStudyGroupRepositoryToken,
} from '@business/repositories/studyGroup/iStudyGroupRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllStudyGroupsUseCase
  implements
    IAbstractUseCase<IInputFindAllStudyGroupsDto, IOutputFindAllStudyGroupsDto>
{
  constructor(
    @inject(IStudyGroupRepositoryToken)
    private studyGroupRepository: IStudyGroupRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindAllStudyGroupsDto
  ): Promise<IOutputFindAllStudyGroupsDto> {
    try {
      const studyGroups = await this.studyGroupRepository.findAll(props)

      return right(studyGroups)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupErrors.loadFailed())
    }
  }
}
