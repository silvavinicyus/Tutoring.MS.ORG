import '@framework/ioc/inversify.config'
import { CreateStudyGroupLeaderOperator } from '@controller/operations/studyGroupLeader/create'
import {
  IInputCreateStudyGroupLeaderProps,
  InputCreateStudyGroupLeader,
} from '@controller/serializers/studyGroupLeader/create'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const createStudyGroupLeader = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputCreateStudyGroupLeaderProps>([
      'leader_uuid',
    ])

    const input = new InputCreateStudyGroupLeader({
      ...requestInput,
      group_uuid: event.pathParameters.group_uuid,
    })

    const operator = container.get(CreateStudyGroupLeaderOperator)

    const studyGroupLeaderResult = await operator.run(input)

    if (studyGroupLeaderResult.isLeft()) {
      throw studyGroupLeaderResult.value
    }

    return httpResponse('created', studyGroupLeaderResult.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'Internal server error in study group leader creation'
    )
  }
}

export const handler = middyfy(createStudyGroupLeader)
