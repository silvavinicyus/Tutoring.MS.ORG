import '@framework/ioc/inversify.config'
import { RequestToJoinStudyGroupOperator } from '@controller/operations/studyGroupStudent/requestToJoin'
import { InputRequestToJoinStudyGroup } from '@controller/serializers/studyGroupStudent/requestToJoin'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const requestToJoin = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const input = new InputRequestToJoinStudyGroup({
      group_uuid: event.pathParameters.group_uuid,
    })

    const operator = container.get(RequestToJoinStudyGroupOperator)

    const studyGroupStudentResult = await operator.run(
      input,
      event.requestContext.authorizer
    )

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
      'Internal server error in student request to join'
    )
  }
}

export const handler = middyfy(requestToJoin)
