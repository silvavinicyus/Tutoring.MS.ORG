import { inject, injectable } from 'inversify'
import {
  IInputFindByStudyGroupRequestDto,
  IOutputFindByStudyGroupRequestDto,
} from '@business/dto/studyGroupRequest/findBy'
import {
  IStudyGroupRequestRepository,
  IStudyGroupRequestRepositoryToken,
} from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { StudyGroupRequestErrors } from '@business/module/errors/studyGroupRequestErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindByStudyGroupRequestUseCase
  implements
    IAbstractUseCase<
      IInputFindByStudyGroupRequestDto,
      IOutputFindByStudyGroupRequestDto
    >
{
  constructor(
    @inject(IStudyGroupRequestRepositoryToken)
    private studyGroupRequestRepository: IStudyGroupRequestRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputFindByStudyGroupRequestDto
  ): Promise<IOutputFindByStudyGroupRequestDto> {
    try {
      const studyGroupRequest = await this.studyGroupRequestRepository.findBy(
        props
      )

      if (!studyGroupRequest) {
        return left(StudyGroupRequestErrors.notFound())
      }

      return right(studyGroupRequest)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupRequestErrors.loadFailed())
    }
  }
}
