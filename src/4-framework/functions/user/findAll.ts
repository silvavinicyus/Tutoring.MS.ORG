import '@framework/ioc/inversify.config'
import { FindAllUsersOperator } from '@controller/operations/user/findAll'
import { InputFindAllUsers } from '@controller/serializers/user/findAll'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IOrdenationColumn } from '@shared/utils/order'
import { IError } from '@shared/IError'

const findAllUsers = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const orders = event.queryStringParameters?.orders
    let getOrdersArrayObject = []
    if (orders) {
      getOrdersArrayObject = JSON.parse(orders)
    }

    const input = new InputFindAllUsers({
      count: +event.queryStringParameters?.count || 10,
      page: +event.queryStringParameters?.page || 0,
      orders: getOrdersArrayObject as unknown as IOrdenationColumn[],
      contains: [],
    })

    const operator = container.get(FindAllUsersOperator)
    const users = await operator.run(input)

    if (users.isLeft()) {
      throw users.value
    }

    return httpResponse('ok', users.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server error in users search'
    )
  }
}

export const handler = middyfy(findAllUsers)
