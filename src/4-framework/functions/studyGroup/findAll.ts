import '@framework/ioc/inversify.config'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IOrdenationColumn } from '@shared/utils/order'
import { IError } from '@shared/IError'
import { InputFindAllStudyGroups } from '@controller/serializers/studyGroup/findAll'
import { FindAllStudyGroupsOperator } from '@controller/operations/studyGroup/findAll'

const findAllStudyGroups = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const orders = event.queryStringParameters?.orders
    let getOrdersArrayObject = []
    if (orders) {
      getOrdersArrayObject = JSON.parse(orders)
    }

    const input = new InputFindAllStudyGroups({
      count: +event.queryStringParameters?.count || 10,
      page: +event.queryStringParameters?.page || 0,
      orders: getOrdersArrayObject as unknown as IOrdenationColumn[],
      contains: [
        {
          column: 'creator_id',
          value: event.queryStringParameters?.creator_id,
        },
      ],
    })

    const operator = container.get(FindAllStudyGroupsOperator)
    const studyGroup = await operator.run(input)

    if (studyGroup.isLeft()) {
      throw studyGroup.value
    }

    return httpResponse('ok', studyGroup.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server error in study groups search'
    )
  }
}

export const handler = middyfy(findAllStudyGroups)
