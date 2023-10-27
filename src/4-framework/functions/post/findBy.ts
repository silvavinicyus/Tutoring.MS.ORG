import '@framework/ioc/inversify.config'
import { FindPostByOperator } from '@controller/operations/post/findBy'
import { InputFindPostBy } from '@controller/serializers/post/findBy'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const findPostBy = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const input = new InputFindPostBy({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(FindPostByOperator)
    const post = await operator.run(input, event.requestContext.authorizer)

    if (post.isLeft()) {
      throw post.value
    }

    return httpResponse('ok', post.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse('internalError', 'internal server error in post search')
  }
}

export const handler = middyfy(findPostBy)
