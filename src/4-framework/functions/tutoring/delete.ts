import '@framework/ioc/inversify.config'
import { DeleteTutoringOperator } from '@controller/operations/tutoring/delete'
import { InputDeleteTutoring } from '@controller/serializers/tutoring/delete'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const deleteTutoring = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const input = new InputDeleteTutoring({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(DeleteTutoringOperator)
    const tutoringResult = await operator.run(input)

    if (tutoringResult.isLeft()) {
      throw tutoringResult.value
    }

    return httpResponse('noContent', void 0)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server erro in tutoring removal'
    )
  }
}

export const handler = middyfy(deleteTutoring)
