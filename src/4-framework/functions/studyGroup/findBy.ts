import '@framework/ioc/inversify.config'
import { FindByStudyGroupOperator } from '@controller/operations/studyGroup/findBy'
import { InputFindStudyGroupBy } from '@controller/serializers/studyGroup/findBy'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const findStudyGroupBy = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const input = new InputFindStudyGroupBy({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(FindByStudyGroupOperator)
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
      'internal server error in study group search'
    )
  }
}

export const handler = middyfy(findStudyGroupBy)
