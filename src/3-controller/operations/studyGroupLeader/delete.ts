import { inject, injectable } from 'inversify'
import { InputDeleteStudyGroupLeader } from '@controller/serializers/studyGroupLeader/delete'
import { IOutputDeleteStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/delete'
import { DeleteStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/deleteStudyGroupLeader'
import { FindByStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/findByStudyGroupLeader'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteStudyGroupLeaderOperator extends AbstractOperator<
  InputDeleteStudyGroupLeader,
  IOutputDeleteStudyGroupLeaderDto
> {
  constructor(
    @inject(DeleteStudyGroupLeaderUseCase)
    private deleteStudyGroupLeader: DeleteStudyGroupLeaderUseCase,
    @inject(FindByStudyGroupLeaderUseCase)
    private findByStudyGroupLeader: FindByStudyGroupLeaderUseCase
  ) {
    super()
  }

  async run(
    input: InputDeleteStudyGroupLeader
  ): Promise<IOutputDeleteStudyGroupLeaderDto> {
    this.exec(input)

    const studyGroupLeader = await this.findByStudyGroupLeader.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (studyGroupLeader.isLeft()) {
      return left(studyGroupLeader.value)
    }

    const studyGroupLeaderResult = await this.deleteStudyGroupLeader.exec({
      id: studyGroupLeader.value.id,
    })

    if (studyGroupLeaderResult.isLeft()) {
      return left(studyGroupLeaderResult.value)
    }

    return studyGroupLeaderResult
  }
}
