import '@framework/ioc/inversify.config'
import { FindAllTutoringsOperator } from '@controller/operations/tutoring/findAll'
import { InputFindAllTutorings } from '@controller/serializers/tutoring/findAll'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IOrdenationColumn } from '@shared/utils/order'
import { IError } from '@shared/IError'
import { createContainsArray } from '@framework/utility/createContainsArray'

const findAllTutorings = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const orders = event.queryStringParameters?.orders
    let getOrdersArrayObject = []
    if (orders) {
      getOrdersArrayObject = JSON.parse(orders)
    }

    const input = new InputFindAllTutorings({
      count: +event.queryStringParameters?.count || 10,
      page: +event.queryStringParameters?.page || 0,
      orders: getOrdersArrayObject as unknown as IOrdenationColumn[],
      contains: createContainsArray([
        {
          column: 'tutor_id',
          value: +event.queryStringParameters?.tutor_id,
        },
        {
          column: 'student_id',
          value: +event.queryStringParameters?.student_id,
        },
      ]),
    })

    const operator = container.get(FindAllTutoringsOperator)
    const tutorings = await operator.run(input)

    if (tutorings.isLeft()) {
      throw tutorings.value
    }

    return httpResponse('ok', tutorings.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server error in tutorings search'
    )
  }
}

export const handler = middyfy(findAllTutorings)
