import '@framework/ioc/inversify.config'
import { FindUserByOperator } from '@controller/operations/user/findBy'
import { InputFindUserBy } from '@controller/serializers/user/findBy'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const findUserBy = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const input = new InputFindUserBy({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(FindUserByOperator)
    const user = await operator.run(input)

    if (user.isLeft()) {
      throw user.value
    }

    return httpResponse('ok', user.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse('internalError', 'internal server error in user search')
  }
}

export const handler = middyfy(findUserBy)
