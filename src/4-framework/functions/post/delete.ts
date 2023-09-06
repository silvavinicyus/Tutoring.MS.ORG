import '@framework/ioc/inversify.config'
import { DeletePostOperator } from '@controller/operations/post/delete'
import { InputDeletePost } from '@controller/serializers/post/delete'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const deletePost = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const input = new InputDeletePost({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(DeletePostOperator)
    const postResult = await operator.run(input)

    if (postResult.isLeft()) {
      throw postResult.value
    }

    return httpResponse('noContent', void 0)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse('internalError', 'internal server erro in post removal')
  }
}

export const handler = middyfy(deletePost)
