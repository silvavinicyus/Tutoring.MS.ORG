import '@framework/ioc/inversify.config'
import { FindTutoringByOperator } from '@controller/operations/tutoring/findBy'
import { InputFindByTutoring } from '@controller/serializers/tutoring/findBy'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const findTutoringBy = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const input = new InputFindByTutoring({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(FindTutoringByOperator)
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
      'internal server error in tutoring search'
    )
  }
}

export const handler = middyfy(findTutoringBy)
