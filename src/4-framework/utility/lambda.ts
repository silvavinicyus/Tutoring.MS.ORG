import { RequestEventMiddyMiddleware } from '@framework/middlewares/eventRequestMethods'
import { sequelize } from '@framework/utility/database'
import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpMultipartBodyParser from '@middy/http-multipart-body-parser'
import { Context } from 'aws-lambda'

export const middyfy = (
  handler: (e: unknown, context?: Context) => Promise<unknown>
): middy.Middy<unknown, unknown, Context> =>
  middy(async (e: unknown, c: Context) => {
    sequelize.connectionManager.initPools()
    if (sequelize.connectionManager.hasOwnProperty('getConnection')) {
      delete sequelize.connectionManager.getConnection
    }
    // eslint-disable-next-line no-param-reassign
    c.callbackWaitsForEmptyEventLoop = false

    return handler(e, c)
  })
    .use(httpHeaderNormalizer())
    .use(jsonBodyParser())
    .use(httpMultipartBodyParser())
    .use(httpCors())
    .use(RequestEventMiddyMiddleware())
    .after(async () => {
      await sequelize.connectionManager.pool.drain()
      return sequelize.connectionManager.pool.destroyAllNow()
    })
