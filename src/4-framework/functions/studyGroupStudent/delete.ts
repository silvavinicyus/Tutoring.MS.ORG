import '@framework/ioc/inversify.config'
import { DeleteStudyGroupStudentOperator } from '@controller/operations/studyGroupStudent/delete'
import { InputDeleteStudyGroupStudent } from '@controller/serializers/studyGroupStudent/delete'
import { httpResponse } from '@framework/utility/httpResponse'
import { middyfy } from '@framework/utility/lambda'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { IError } from '@shared/IError'
import { container } from '@shared/ioc/container'

const deleteStudyGroupStudent = async (
  event: IHandlerInput
): Promise<IHandlerResult> => {
  try {
    const input = new InputDeleteStudyGroupStudent({
      uuid: event.pathParameters.uuid,
    })

    const operator = container.get(DeleteStudyGroupStudentOperator)
    const studyGroupStudentResult = await operator.run(input)

    if (studyGroupStudentResult.isLeft()) {
      throw studyGroupStudentResult.value
    }

    return httpResponse('noContent', void 0)
  } catch (err) {
    console.error(err)

    if (err instanceof IError) {
      return httpResponse(err.statusCode, err.body)
    }

    return httpResponse(
      'internalError',
      'internal server erro in study group student removal'
    )
  }
}

export const handler = middyfy(deleteStudyGroupStudent)
