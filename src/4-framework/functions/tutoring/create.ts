import '@framework/ioc/inversify.config'
import { IInputCreateTutoringDto } from '@business/dto/tutoring/create'
import { CreateTutoringOperator } from '@controller/operations/tutoring/create'
import { InputCreateTutoring } from '@controller/serializers/tutoring/create'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const createTutoring = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputCreateTutoringDto>([
      'date',
      'subject',
    ])

    const input = new InputCreateTutoring({
      ...requestInput,
      date: requestInput.date ? new Date(requestInput.date) : undefined,
      student_uuid: event.pathParameters.student_uuid,
      tutor_uuid: event.pathParameters.tutor_uuid,
    })

    const operator = container.get(CreateTutoringOperator)

    const tutoringResult = await operator.run(input)

    if (tutoringResult.isLeft()) {
      throw tutoringResult.value
    }

    return httpResponse('created', tutoringResult.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'Internal server error in tutoring creation'
    )
  }
}

export const handler = middyfy(createTutoring)
