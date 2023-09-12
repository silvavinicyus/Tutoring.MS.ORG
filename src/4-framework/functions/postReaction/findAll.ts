import '@framework/ioc/inversify.config'
import { FindAllPostReactionsOperator } from '@controller/operations/postReaction/findAll'
import { InputFindAllPostReactions } from '@controller/serializers/postReaction/findAll'
import { PostReactionTypes } from '@domain/entities/postReactions'
import { createContainsArray } from '@framework/utility/createContainsArray'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'
import { IOrdenationColumn } from '@shared/utils/order'

const findAllPostReactions = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const orders = event.queryStringParameters?.orders
    let getOrdersArrayObject = []
    if (orders) {
      getOrdersArrayObject = JSON.parse(orders)
    }

    const input = new InputFindAllPostReactions({
      count: +event.queryStringParameters?.count || 10,
      page: +event.queryStringParameters?.page || 0,
      orders: getOrdersArrayObject as unknown as IOrdenationColumn[],
      contains: createContainsArray([
        {
          column: 'type',
          value: PostReactionTypes[event.queryStringParameters?.type],
        },
      ]),
      post_uuid: event.pathParameters?.uuid,
    })

    const operator = container.get(FindAllPostReactionsOperator)
    const postReactions = await operator.run(input)

    if (postReactions.isLeft()) {
      throw postReactions.value
    }

    return httpResponse('ok', postReactions.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server error in post reactions search'
    )
  }
}

export const handler = middyfy(findAllPostReactions)
