import { inject, injectable } from 'inversify'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import {
  IInputStudyGroupStudentEntity,
  StudyGroupStudentEntity,
} from '@domain/entities/studyGroupStudents'
import {
  IInputCreateStudyGroupStudentDto,
  IOutputCreateStudyGroupStudentDto,
} from '@business/dto/studyGroupStudent/create'
import { ITransaction } from '@business/dto/transaction/create'
import {
  IStudyGroupStudentRepository,
  IStudyGroupStudentRepositoryToken,
} from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateStudyGroupStudentUseCase
  implements
    IAbstractUseCase<
      IInputCreateStudyGroupStudentDto,
      IOutputCreateStudyGroupStudentDto
    >
{
  constructor(
    @inject(IStudyGroupStudentRepositoryToken)
    private studyGroupStudentRepository: IStudyGroupStudentRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputStudyGroupStudentEntity,
    trx?: ITransaction
  ): Promise<IOutputCreateStudyGroupStudentDto> {
    try {
      const studyGroupStudentEntity = StudyGroupStudentEntity.create(
        props,
        new Date()
      )

      const studyGroupStudentResult =
        await this.studyGroupStudentRepository.create(
          {
            ...studyGroupStudentEntity.value.export(),
            uuid: this.uniqueIdentifier.create(),
          },
          trx
        )

      return right(studyGroupStudentResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StudyGroupStudentErrors.creationError())
    }
  }
}
