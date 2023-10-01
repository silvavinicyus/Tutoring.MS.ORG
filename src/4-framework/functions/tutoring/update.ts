import '@framework/ioc/inversify.config'
import { UpdateTutoringOperator } from '@controller/operations/tutoring/update'
import { InputUpdateTutoring } from '@controller/serializers/tutoring/update'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const updateTutoring = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const input = new InputUpdateTutoring({
      uuid: event.pathParameters.uuid,
      date: event.body?.date ? new Date(event.body?.date) : undefined,
    })

    const operator = container.get(UpdateTutoringOperator)
    const tutoring = await operator.run(input)

    if (tutoring.isLeft()) {
      throw tutoring.value
    }

    return httpResponse('ok', tutoring.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server error in tutoring update'
    )
  }
}

export const handler = middyfy(updateTutoring)
