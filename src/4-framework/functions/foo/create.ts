import '@framework/ioc/inversify.config'
import { IInputCreateFooDto } from '@business/dto/foo/createFooDto'
import { CreateFooOperator } from '@controller/operations/foo/createFoo'
import { InputCreateFoo } from '@controller/serializers/foo/createFoo'
import { LoggerService } from '@framework/services/logger/loggerService'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const createFoo = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputCreateFooDto>(['title'])

    const input = new InputCreateFoo(requestInput)
    const operator = container.get(CreateFooOperator)
    const fooResult = await operator.run(input, event.requestContext.authorizer)
    if (fooResult.isLeft()) {
      throw fooResult.value
    }

    return httpResponse('created', fooResult.value)
  } catch (err) {
    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }
    const logger = new LoggerService()
    logger.error(err)
    return httpResponse(
      'internalError',
      'Internal server error in foo creation'
    )
  }
}

export const handler = middyfy(createFoo)
