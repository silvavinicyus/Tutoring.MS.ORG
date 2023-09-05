import { IInputCreateUserDto } from '@business/dto/user/create'
import { CreateUserOperator } from '@controller/operations/user/create'
import { InputCreateUser } from '@controller/serializers/user/create'
import '@framework/ioc/inversify.config'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const createUser = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputCreateUserDto>([
      'name',
      'email',
      'birthdate',
      'phone',
    ])

    const input = new InputCreateUser({
      ...requestInput,
      birthdate: new Date(requestInput.birthdate),
    })
    const operator = container.get(CreateUserOperator)
    const userResult = await operator.run(
      input,
      event.requestContext.authorizer
    )

    console.log(userResult.isLeft())
    console.log(userResult.isRight())

    if (userResult.isLeft()) {
      throw userResult.value
    }

    return httpResponse('created', userResult.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'Internal server error in user creation'
    )
  }
}

export const handler = middyfy(createUser)
