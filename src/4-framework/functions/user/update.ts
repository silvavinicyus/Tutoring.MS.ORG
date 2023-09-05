import '@framework/ioc/inversify.config'
import { UpdateUserOperator } from '@controller/operations/user/update'
import { InputUpdateUser } from '@controller/serializers/user/update'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const updateUser = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const input = new InputUpdateUser({
      uuid: event.pathParameters.uuid,
      birthdate: event.body.birthdate
        ? new Date(event.body.birthdate)
        : undefined,
      email: event.body?.email,
      name: event.body?.name,
      phone: event.body?.phone,
    })

    const operator = container.get(UpdateUserOperator)
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

    return httpResponse('internalError', 'internal server error in user update')
  }
}

export const handler = middyfy(updateUser)
