import '@framework/ioc/inversify.config'
import { FindAllPostsOperator } from '@controller/operations/post/findAll'
import { InputFindAllPosts } from '@controller/serializers/post/findAll'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IOrdenationColumn } from '@shared/utils/order'
import { IError } from '@shared/IError'
import { createContainsArray } from '@framework/utility/createContainsArray'

const findAllPosts = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const orders = event.queryStringParameters?.orders
    let getOrdersArrayObject = []
    if (orders) {
      getOrdersArrayObject = JSON.parse(orders)
    }

    const input = new InputFindAllPosts({
      count: +event.queryStringParameters?.count || 10,
      page: +event.queryStringParameters?.page || 0,
      orders: getOrdersArrayObject as unknown as IOrdenationColumn[],
      contains: createContainsArray([
        {
          column: 'group_id',
          value: +event.queryStringParameters?.group_id,
        },
        {
          column: 'owner_id',
          value: +event.queryStringParameters?.owner_id,
        },
      ]),
    })

    const operator = container.get(FindAllPostsOperator)
    const posts = await operator.run(input)

    if (posts.isLeft()) {
      throw posts.value
    }

    return httpResponse('ok', posts.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server error in posts search'
    )
  }
}

export const handler = middyfy(findAllPosts)
