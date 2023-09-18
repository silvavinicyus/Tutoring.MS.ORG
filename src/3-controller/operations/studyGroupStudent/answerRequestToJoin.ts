import { inject, injectable } from 'inversify'
import { DeleteStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/deleteStudyGroupRequest'
import { FindByStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/findbyStudyGroupRequest'
import { CreateStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/createStudyGroupStudent'
import { CreateTransactionUseCase } from '@business/useCases/transaction/CreateTransactionUseCase'
import {
  IOutputAnswerRequestToJoinDto,
  InputAnswerRequestToJoinStudyGroup,
} from '@controller/serializers/studyGroupStudent/answerRequestToJoin'
import { left, right } from '@shared/either'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class AnswerRequestToJoinStudyGroupOperator extends AbstractOperator<
  InputAnswerRequestToJoinStudyGroup,
  IOutputAnswerRequestToJoinDto
> {
  constructor(
    @inject(CreateTransactionUseCase)
    private createTransaction: CreateTransactionUseCase,
    @inject(DeleteStudyGroupRequestUseCase)
    private deleteStudyGroupRequest: DeleteStudyGroupRequestUseCase,
    @inject(CreateStudyGroupStudentUseCase)
    private createStudyGroupStudent: CreateStudyGroupStudentUseCase,
    @inject(FindByStudyGroupRequestUseCase)
    private findByStudyGroupRequest: FindByStudyGroupRequestUseCase
  ) {
    super()
  }

  async run(
    input: InputAnswerRequestToJoinStudyGroup
  ): Promise<IOutputAnswerRequestToJoinDto> {
    this.exec(input)

    const groupRequest = await this.findByStudyGroupRequest.exec({
      where: [
        {
          column: 'uuid',
          value: input.group_request_uuid,
        },
      ],
    })

    if (groupRequest.isLeft()) {
      return left(groupRequest.value)
    }

    if (!input.answer) {
      const deleteRequest = await this.deleteStudyGroupRequest.exec({
        uuid: input.group_request_uuid,
      })

      if (deleteRequest.isLeft()) {
        return left(deleteRequest.value)
      }

      return right(void 0)
    }

    const transaction = await this.createTransaction.exec()
    if (transaction.isLeft()) {
      return left(transaction.value)
    }

    const studyGroupStudent = await this.createStudyGroupStudent.exec(
      {
        group_id: groupRequest.value.group_id,
        student_id: groupRequest.value.requester_id,
      },
      transaction.value.trx
    )

    if (studyGroupStudent.isLeft()) {
      await transaction.value.rollback()
      return left(studyGroupStudent.value)
    }

    const deleteRequest = await this.deleteStudyGroupRequest.exec(
      {
        uuid: groupRequest.value.uuid,
      },
      transaction.value.trx
    )

    if (deleteRequest.isLeft()) {
      await transaction.value.rollback()
      return left(deleteRequest.value)
    }

    await transaction.value.commit()
    return right(void 0)
  }
}
