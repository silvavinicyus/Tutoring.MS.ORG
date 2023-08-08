import { IAuthorizerInformation } from '@business/dto/role/authorize'
import { APIGatewayProxyEventBase, APIGatewayProxyResult } from 'aws-lambda'

export interface ITokenPayload {
  user_id: number
  user_uuid: string
  [index: string]: string | number
}

export interface IRequestMethods {
  only: <E>(array: (keyof E)[]) => E
  input: (input: string) => unknown | undefined
  pathParam: <I, D = undefined>(
    input: keyof I,
    defaultValue?: D
  ) => Record<keyof I, string | D>
  pathParams: <E>(array: (keyof E)[]) => E
  qs: <E>(array: (keyof E)[]) => E
}

export interface IHandlerInput
  extends Omit<APIGatewayProxyEventBase<IAuthorizerInformation>, 'body'>,
    IRequestMethods {
  body: { [k: string]: string | undefined }
}

export interface IHandlerResult extends Omit<APIGatewayProxyResult, 'body'> {
  body: unknown
}
