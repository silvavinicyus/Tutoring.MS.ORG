import { injectable } from 'inversify'
import dayjs from 'dayjs'
import { IDateService } from '@business/services/date/iDateService'

@injectable()
export class DateService implements IDateService {
  init(): Date {
    const date = dayjs()
    return date.toDate()
  }
  add(
    date: Date,
    increment: { value: number; unit: 'day' | 'hour' | 'minute' }
  ): Date {
    const addedDate = dayjs(date).add(increment.value, increment.unit)
    return addedDate.toDate()
  }
}
