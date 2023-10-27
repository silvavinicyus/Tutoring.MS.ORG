import '@framework/ioc/inversify.config'
import { DeleteStudyGroupLeaderOperator } from '@controller/operations/studyGroupLeader/delete'
import { InputDeleteStudyGroupLeader } from '@controller/serializers/studyGroupLeader/delete'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const deleteStudyGroupLeader = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const input = new InputDeleteStudyGroupLeader({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(DeleteStudyGroupLeaderOperator)
    const studyGroupLeaderResult = await operator.run(
      input,
      event.requestContext.authorizer
    )

    if (studyGroupLeaderResult.isLeft()) {
      throw studyGroupLeaderResult.value
    }

    return httpResponse('noContent', void 0)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server erro in study group leader removal'
    )
  }
}

export const handler = middyfy(deleteStudyGroupLeader)
