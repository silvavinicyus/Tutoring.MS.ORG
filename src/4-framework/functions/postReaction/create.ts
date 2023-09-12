import '@framework/ioc/inversify.config'
import { CreatePostReactionOperator } from '@controller/operations/postReaction/create'
import {
  IInputCreatePostReactionProps,
  InputCreatePostReaction,
} from '@controller/serializers/postReaction/create'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'
import { PostReactionTypes } from '@domain/entities/postReactions'

const createPostReaction = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputCreatePostReactionProps>(['user_id'])

    const input = new InputCreatePostReaction({
      ...requestInput,
      type: PostReactionTypes[event.body.type],
      post_uuid: event.pathParameters.uuid,
    })

    const operator = container.get(CreatePostReactionOperator)

    const postReactionResult = await operator.run(input)

    if (postReactionResult.isLeft()) {
      throw postReactionResult.value
    }

    return httpResponse('created', postReactionResult.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'Internal server error in post reaction creation'
    )
  }
}

export const handler = middyfy(createPostReaction)
