import '@framework/ioc/inversify.config'
import { IInputCreatePostDto } from '@business/dto/post/create'
import { CreatePostOperator } from '@controller/operations/post/create'
import { InputCreatePost } from '@controller/serializers/post/create'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const createPost = async (event: IHandlerInput): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputCreatePostDto>([
      'title',
      'content',
      'fixed',
      'group_id',
      'image_id',
      'owner_id',
    ])

    const input = new InputCreatePost({ ...requestInput })
    const operator = container.get(CreatePostOperator)

    const postResult = await operator.run(
      input,
      event.requestContext.authorizer
    )

    if (postResult.isLeft()) {
      throw postResult.value
    }

    return httpResponse('created', postResult.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'Internal server error in post creation'
    )
  }
}

export const handler = middyfy(createPost)
