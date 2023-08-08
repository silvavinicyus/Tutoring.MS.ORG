import { IRelation } from '@business/repositories/relation'

export interface IPagination {
  count: number
  page: number
}

export interface IContainsOptions<C, V> {
  column: C
  value: V
}

export interface IFilter<C = unknown, V = string> {
  contains?: IContainsOptions<C, V>[]
  getShutdown?: boolean
  getDeactivated?: boolean
  getSoftDeleteds?: boolean
  getFollowUp?: boolean
}

export interface IUseCaseOptions {
  transaction?: unknown
  pagination?: IPagination | null
  relations?: IRelation<string, unknown>[]
}

export interface IPaginatedResponse<T = unknown> {
  count: number
  page: number
  perPage: number
  items: T[]
}
