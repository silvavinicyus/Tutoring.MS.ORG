import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { Right, right } from '@shared/either'
import { IUserEntity } from './user'

interface IStudyGroupRequestRelations {
  requester: IUserEntity
}

export interface IStudyGroupRequestEntity
  extends ITimestamps,
    Partial<IStudyGroupRequestRelations> {
  id: number
  uuid: string
  group_id: number
  requester_id: number
}

export type IInputStudyGroupRequestEntity = Pick<
  IStudyGroupRequestEntity,
  'group_id' | 'requester_id'
>

export type StudyGroupRequestEntityKeys = Pick<
  IStudyGroupRequestEntity,
  'group_id' | 'requester_id' | 'id' | 'uuid'
>

export class StudyGroupRequestEntity extends AbstractEntity<IStudyGroupRequestEntity> {
  static create(
    props: IInputStudyGroupRequestEntity,
    currentDate: Date
  ): Right<void, StudyGroupRequestEntity> {
    const studyGroup = new StudyGroupRequestEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })
    return right(studyGroup)
  }
}
