import '@framework/ioc/inversify.config'
import { DeletePostReactionOperator } from '@controller/operations/postReaction/delete'
import { InputDeletePostReaction } from '@controller/serializers/postReaction/delete'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const deletePostReaction = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const input = new InputDeletePostReaction({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(DeletePostReactionOperator)
    const postReactionResult = await operator.run(input)

    if (postReactionResult.isLeft()) {
      throw postReactionResult.value
    }

    return httpResponse('noContent', void 0)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server erro in post reaction removal'
    )
  }
}

export const handler = middyfy(deletePostReaction)
