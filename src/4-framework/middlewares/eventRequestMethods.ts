import middy from '@middy/core'
import { IHandlerInput, IHandlerResult } from '@framework/utility/types'
import { Context } from 'aws-lambda'
import { methods } from '@framework/utility/middleware'

/**
 * This middleware must be used with @middy/http-error-handler
 */
export const RequestEventMiddyMiddleware = (): middy.MiddlewareObject<
  IHandlerInput,
  IHandlerResult,
  Context
> => ({
  before: async ({ event }) => {
    const eventMethods = methods(event)

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(eventMethods)) {
      Object.defineProperty(event, key, {
        value,
        enumerable: true,
      })
    }
  },
})
