import '@framework/ioc/inversify.config'
import { CreateStudyGroupOperator } from '@controller/operations/studyGroup/create'
import {
  IInputCreateStudyGroupProps,
  InputCreateStudyGroup,
} from '@controller/serializers/studyGroup/create'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const createStudyGroup = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputCreateStudyGroupProps>([
      'name',
      'subject',
    ])

    const input = new InputCreateStudyGroup({
      ...requestInput,
    })
    const operator = container.get(CreateStudyGroupOperator)
    const studyGroupResult = await operator.run(
      input,
      event.requestContext.authorizer
    )

    if (studyGroupResult.isLeft()) {
      throw studyGroupResult.value
    }

    return httpResponse('created', studyGroupResult.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'Internal server error in study group creation'
    )
  }
}

export const handler = middyfy(createStudyGroup)
