import { inject, injectable } from 'inversify'
import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { IOutputCreateStudyGroupDto } from '@business/dto/studyGroup/create'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { CreateStudyGroupUseCase } from '@business/useCases/studyGroup/createStudyGroup'
import { CreateStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/createStudyGroupStudent'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import { InputCreateStudyGroup } from '@controller/serializers/studyGroup/create'
import { left } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateStudyGroupOperator extends AbstractOperator<
  InputCreateStudyGroup,
  IOutputCreateStudyGroupDto
> {
  constructor(
    @inject(CreateStudyGroupUseCase)
    private createStudyGroup: CreateStudyGroupUseCase,
    @inject(VerifyProfileUseCase)
    private verifyProfile: VerifyProfileUseCase,
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase,
    @inject(CreateStudyGroupStudentUseCase)
    private createGroupStudent: CreateStudyGroupStudentUseCase
  ) {
    super()
  }

  async run(
    input: InputCreateStudyGroup,
    authorizer: IAuthorizerInformation
  ): Promise<IOutputCreateStudyGroupDto> {
    this.exec(input)

    const authUser = await this.verifyProfile.exec({
      permissions: ['create_study_group'],
      user: authorizer,
    })

    if (authUser.isLeft()) {
      return left(authUser.value)
    }

    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }

    const studyGroupResult = await this.createStudyGroup.exec(
      { ...input, creator_id: authorizer.user_real_id },
      transaction.value.trx
    )
    if (studyGroupResult.isLeft()) {
      await transaction.value.rollback()
      return left(studyGroupResult.value)
    }

    const studentGroup = await this.createGroupStudent.exec(
      {
        group_id: studyGroupResult.value.id,
        student_id: authUser.value.user_real_id,
      },
      transaction.value.trx
    )

    if (studentGroup.isLeft()) {
      await transaction.value.rollback()
      return left(studentGroup.value)
    }

    await transaction.value.commit()
    return studyGroupResult
  }
}
