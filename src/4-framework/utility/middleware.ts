import { IHandlerInput, IRequestMethods } from './types'

type IEventRecord<T> = {
  [k in keyof T]: unknown | undefined
}

const defineObjectProperty = <E>(
  object: IEventRecord<E>,
  array: (keyof E)[]
): E => {
  const result = {}

  array.forEach((key) => {
    Object.defineProperty(result, key, {
      value: typeof key === 'number' ? +object[key] : object[key],
      enumerable: true,
    })
  })

  return result as E
}

export const methods = (event: IHandlerInput): IRequestMethods => ({
  only<E>(array: (keyof E)[]): E {
    return defineObjectProperty<E>(event.body as IEventRecord<E>, array)
  },
  input(input: string) {
    return { [input]: event.body[input] }
  },
  pathParam<I, D = undefined>(
    input: keyof I,
    defaultValue?: D
  ): Record<keyof I, string | D> {
    return {
      [input]: event.pathParameters[input as string] || defaultValue,
    } as Record<keyof I, string | D>
  },
  pathParams<E>(array: (keyof E)[]): E {
    return defineObjectProperty<E>(
      event.pathParameters as IEventRecord<E>,
      array
    )
  },
  qs<E>(array: (keyof E)[]): E {
    return defineObjectProperty(
      event.queryStringParameters as IEventRecord<E>,
      array
    )
  },
})
