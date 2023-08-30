import { ITimestamps } from '@domain/timestamps'
import { AbstractEntity } from '@domain/abstractEntity'
import { Right, right } from '@shared/either'
import { IUserEntity } from './user'

interface ITutoringRelations {
  student: IUserEntity
  tutor: IUserEntity
}

export interface ITutoringEntity
  extends ITimestamps,
    Partial<ITutoringRelations> {
  id: number
  uuid: string
  date: Date
  subject: string
  tutor_id: number
  student_id: number
}

export type IInputTutoringEntity = Pick<
  ITutoringEntity,
  'date' | 'subject' | 'tutor_id' | 'student_id'
>

export class TutoringEntity extends AbstractEntity<ITutoringEntity> {
  static create(
    props: IInputTutoringEntity,
    currentDate: Date
  ): Right<void, TutoringEntity> {
    const tutoring = new TutoringEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })

    return right(tutoring)
  }

  static update(
    props: Partial<ITutoringEntity>,
    currentDate: Date
  ): Right<void, TutoringEntity> {
    const tutoring = new TutoringEntity({
      ...props,
      updated_at: currentDate,
    } as ITutoringEntity)

    return right(tutoring)
  }
}
