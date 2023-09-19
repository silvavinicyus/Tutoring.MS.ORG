const { Lambda } = require('aws-sdk')

const authorization = async (event) => {
  console.log('_____teste_____')

  try {
    const lambdaClient = new Lambda({
      region: 'us-east-1',
      endpoint: 'http://localhost:4001/',
    })

    const result = await lambdaClient
      .invoke({
        FunctionName: 'tutoring-auth-dev-authorization',
        Payload: JSON.stringify(event),
      })
      .promise()

    if (result.StatusCode === 200) {
      return JSON.parse(result.Payload)
    }
  } catch (e) {
    console.error(e)
  }

  throw Error('Authorizer error')
}

module.exports = { authorization }
