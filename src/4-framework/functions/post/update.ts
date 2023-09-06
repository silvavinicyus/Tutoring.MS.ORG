import '@framework/ioc/inversify.config'
import { UpdatePostOperator } from '@controller/operations/post/update'
import { InputUpdatePost } from '@controller/serializers/post/update'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'

const updatePost = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const input = new InputUpdatePost({
      uuid: event.pathParameters.uuid,
      title: event.body?.title,
      content: event.body?.content,
      image_id: +event.body?.image_id || undefined,
      fixed: event.body.fixed ? Boolean(event.body?.fixed) : undefined,
    })

    const operator = container.get(UpdatePostOperator)
    const post = await operator.run(input)

    if (post.isLeft()) {
      throw post.value
    }

    return httpResponse('ok', post.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse('internalError', 'internal server error in post update')
  }
}

export const handler = middyfy(updatePost)
