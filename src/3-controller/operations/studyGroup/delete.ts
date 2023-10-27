import { inject, injectable } from 'inversify'
import { IOutputDeleteStudyGroupDto } from '@business/dto/studyGroup/delete'
import { DeleteStudyGroupUseCase } from '@business/useCases/studyGroup/deleteStudyGroup'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { InputDeleteStudyGroup } from '@controller/serializers/studyGroup/delete'
import { left } from '@shared/either'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { DeleteManyStudyGroupStudentsUseCase } from '@business/useCases/studyGroupStudent/deleteManyStudyGroupStudents'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteStudyGroupOperator extends AbstractOperator<
  InputDeleteStudyGroup,
  IOutputDeleteStudyGroupDto
> {
  constructor(
    @inject(DeleteStudyGroupUseCase)
    private deleteStudyGroup: DeleteStudyGroupUseCase,
    @inject(FindStudyGroupByUseCase)
    private findStudyGroup: FindStudyGroupByUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase,
    @inject(DeleteManyStudyGroupStudentsUseCase)
    private deleteManyGroupStudents: DeleteManyStudyGroupStudentsUseCase,
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase
  ) {
    super()
  }
  async run(
    input: InputDeleteStudyGroup,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputDeleteStudyGroupDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['delete_study_group'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const studyGroup = await this.findStudyGroup.exec({
      where: [
        {
          column: 'uuid',
          value: input.uuid,
        },
      ],
    })

    if (studyGroup.isLeft()) {
      return left(studyGroup.value)
    }

    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }

    const studyGroupStudentsResult = await this.deleteManyGroupStudents.exec(
      {
        group_id: studyGroup.value.id,
      },
      transaction.value.trx
    )

    if (studyGroupStudentsResult.isLeft()) {
      await transaction.value.rollback()
      return left(studyGroupStudentsResult.value)
    }

    const studyGroupResult = await this.deleteStudyGroup.exec(
      {
        id: studyGroup.value.id,
      },
      transaction.value.trx
    )

    if (studyGroupResult.isLeft()) {
      await transaction.value.rollback()
      return left(studyGroupResult.value)
    }

    await transaction.value.commit()
    return studyGroupResult
  }
}
