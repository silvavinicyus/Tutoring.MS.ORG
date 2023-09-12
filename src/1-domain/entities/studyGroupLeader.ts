import { ITimestamps } from '@domain/timestamps'
import { AbstractEntity } from '@domain/abstractEntity'
import { Right, right } from '@shared/either'
import { IStudyGroupEntity } from './studyGroup'
import { IUserEntity } from './user'

interface IStudyGroupRelations {
  leader: IUserEntity
  group: IStudyGroupEntity
}

export interface IStudyGroupLeaderEntity
  extends ITimestamps,
    Partial<IStudyGroupRelations> {
  id: number
  uuid: string
  leader_id: number
  group_id: number
}

export type IInputStudyGroupLeaderEntity = Pick<
  IStudyGroupLeaderEntity,
  'group_id' | 'leader_id'
>

export type StudyGroupLeaderEntityKeys = Pick<
  IStudyGroupLeaderEntity,
  'group_id' | 'leader_id' | 'id' | 'uuid'
>

export class StudyGroupLeaderEntity extends AbstractEntity<IStudyGroupLeaderEntity> {
  static create(
    props: IInputStudyGroupLeaderEntity,
    currentDate: Date
  ): Right<void, StudyGroupLeaderEntity> {
    const studyGroup = new StudyGroupLeaderEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })
    return right(studyGroup)
  }

  static update(
    props: Partial<IStudyGroupEntity>,
    currentDate: Date
  ): Right<void, StudyGroupLeaderEntity> {
    const studyGroup = new StudyGroupLeaderEntity({
      ...props,
      updated_at: currentDate,
    } as IStudyGroupLeaderEntity)
    return right(studyGroup)
  }
}
