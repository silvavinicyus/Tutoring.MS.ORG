import '@framework/ioc/inversify.config'
import { FindAllStudyGroupLeadersOperator } from '@controller/operations/studyGroupLeader/findAll'
import { InputFindAllStudyGroupLeaders } from '@controller/serializers/studyGroupLeader/findAll'
import { createContainsArray } from '@framework/utility/createContainsArray'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'
import { IOrdenationColumn } from '@shared/utils/order'

const findAllStudyGroupLeaders = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const orders = event.queryStringParameters?.orders
    let getOrdersArrayObject = []
    if (orders) {
      getOrdersArrayObject = JSON.parse(orders)
    }

    const input = new InputFindAllStudyGroupLeaders({
      count: +event.queryStringParameters?.count || 10,
      page: +event.queryStringParameters?.page || 0,
      orders: getOrdersArrayObject as unknown as IOrdenationColumn[],
      contains: createContainsArray([]),
      group_uuid: event.pathParameters.group_uuid,
    })

    const operator = container.get(FindAllStudyGroupLeadersOperator)
    const studyGroupLeaders = await operator.run(input)

    if (studyGroupLeaders.isLeft()) {
      throw studyGroupLeaders.value
    }

    return httpResponse('ok', studyGroupLeaders.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server error in study group leaders search'
    )
  }
}

export const handler = middyfy(findAllStudyGroupLeaders)
