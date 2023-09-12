import '@framework/ioc/inversify.config'
import { CreateStudyGroupStudentOperator } from '@controller/operations/studyGroupStudent/create'
import {
  IInputCreateStudyGroupStudentProps,
  InputCreateStudyGroupStudent,
} from '@controller/serializers/studyGroupStudent/create'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const createStudyGroupStudent = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const requestInput = event.only<IInputCreateStudyGroupStudentProps>([
      'student_uuid',
    ])

    const input = new InputCreateStudyGroupStudent({
      ...requestInput,
      group_uuid: event.pathParameters.group_uuid,
    })

    const operator = container.get(CreateStudyGroupStudentOperator)

    const studyGroupStudentResult = await operator.run(input)

    if (studyGroupStudentResult.isLeft()) {
      throw studyGroupStudentResult.value
    }

    return httpResponse('created', studyGroupStudentResult.value)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'Internal server error in study group student creation'
    )
  }
}

export const handler = middyfy(createStudyGroupStudent)
