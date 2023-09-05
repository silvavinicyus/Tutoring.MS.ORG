import { IContainsOptions } from '@business/dto/useCaseOptions'

export const createContainsArray = <C, V>(
  values: IContainsOptions<C, V>[]
): IContainsOptions<C, V>[] => values.filter(({ value }) => value !== undefined)
