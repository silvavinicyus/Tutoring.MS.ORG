import '@framework/ioc/inversify.config'
import { AnswerRequestToJoinStudyGroupOperator } from '@controller/operations/studyGroupStudent/answerRequestToJoin'
import {
  IInputAnswerRequestToJoinProps,
  InputAnswerRequestToJoinStudyGroup,
} from '@controller/serializers/studyGroupStudent/answerRequestToJoin'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const answerRequestToJoin = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputAnswerRequestToJoinProps>(['answer'])

    const input = new InputAnswerRequestToJoinStudyGroup({
      ...requestInput,
      group_request_uuid: event.pathParameters.group_request_uuid,
    })

    const operator = container.get(AnswerRequestToJoinStudyGroupOperator)

    const studyGroupStudentResult = await operator.run(input)

    if (studyGroupStudentResult.isLeft()) {
      throw studyGroupStudentResult.value
    }

    return httpResponse('created', studyGroupStudentResult.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'Internal server error in student to join study group'
    )
  }
}

export const handler = middyfy(answerRequestToJoin)
