import '@framework/ioc/inversify.config'
import { DeleteUserOperator } from '@controller/operations/user/delete'
import { InputDeleteUser } from '@controller/serializers/user/delete'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const deleteUser = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const input = new InputDeleteUser({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(DeleteUserOperator)
    const userResult = await operator.run(input)

    if (userResult.isLeft()) {
      throw userResult.value
    }

    return httpResponse('noContent', void 0)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse('internalError', 'internal server erro in user removal')
  }
}

export const handler = middyfy(deleteUser)
