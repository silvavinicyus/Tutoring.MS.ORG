export const IDateServiceToken = Symbol.for('IDateServiceToken')

export interface IDateService {
  init(): Date
  add(
    date: Date,
    increment: { value: number; unit: 'day' | 'hour' | 'minute' }
  ): Date
}
