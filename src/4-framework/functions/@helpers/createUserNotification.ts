/* eslint-disable @typescript-eslint/no-explicit-any */
import { SNSEvent } from 'aws-lambda'
import { Lambda } from 'aws-sdk'
import { middyfy } from '@framework/utility/lambda'
import { MS_AUTH } from '@shared/microServicesConstants'

const createUserNotification = async (event: SNSEvent) => {
  console.log('entrou aqui porra \n\n\n\n\n\n')

  const authClient = new Lambda({
    region: MS_AUTH.region,
    endpoint: MS_AUTH.sns.endpoint,
  })

  console.log('\n\n\n\n\n')
  console.log({
    region: MS_AUTH.region,
    endpoint: MS_AUTH.sns.endpoint,
  })

  await authClient
    .invoke({
      FunctionName: 'tutoring-auth-dev-createUser',
      Payload: JSON.stringify(event) as any,
    })
    .promise()
}

export const handler = middyfy(createUserNotification)
