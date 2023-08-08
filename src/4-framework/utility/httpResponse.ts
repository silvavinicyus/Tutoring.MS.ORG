const types = {
  ok: {
    statusCode: 200,
  },
  created: {
    statusCode: 201,
  },
  noContent: {
    statusCode: 204,
  },
  badRequest: {
    statusCode: 400,
  },
  notFound: {
    statusCode: 404,
  },
  internalError: {
    statusCode: 500,
  },
}

export const httpResponse = (
  responseType: keyof typeof types | number,
  body: unknown,
  lambdaResponseRest: { [k: string]: unknown } = {}
): {
  statusCode: number
  body: string
  [k: string]: unknown
} => ({
  statusCode: types[responseType]?.statusCode || responseType,
  body: JSON.stringify(body),
  ...lambdaResponseRest,
})
