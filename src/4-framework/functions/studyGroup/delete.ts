import '@framework/ioc/inversify.config'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/IError'
import { InputDeleteStudyGroup } from '@controller/serializers/studyGroup/delete'
import { DeleteStudyGroupOperator } from '@controller/operations/studyGroup/delete'

const deleteStudyGroup = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const input = new InputDeleteStudyGroup({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(DeleteStudyGroupOperator)
    const studyGroupResult = await operator.run(input)

    if (studyGroupResult.isLeft()) {
      throw studyGroupResult.value
    }

    return httpResponse('noContent', void 0)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server erro in study group removal'
    )
  }
}

export const handler = middyfy(deleteStudyGroup)
