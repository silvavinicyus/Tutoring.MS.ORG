import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { Right, right } from '@shared/either'
import { IUserEntity } from './user'

interface IStudyGroupRelations {
  creator: IUserEntity
  leaders: IUserEntity[]
  students: IUserEntity[]
}

export interface IStudyGroupEntity
  extends ITimestamps,
    Partial<IStudyGroupRelations> {
  id: number
  uuid: string
  name: string
  subject: string
  creator_id: string
}

export type IInputStudyGroupEntity = Pick<
  IStudyGroupEntity,
  'name' | 'subject' | 'creator_id'
>

export class StudyGroupEntity extends AbstractEntity<IStudyGroupEntity> {
  static create(
    props: IInputStudyGroupEntity,
    currentDate: Date
  ): Right<void, StudyGroupEntity> {
    const studyGroup = new StudyGroupEntity({
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
  ): Right<void, StudyGroupEntity> {
    const studyGroup = new StudyGroupEntity({
      ...props,
      updated_at: currentDate,
    } as IStudyGroupEntity)
    return right(studyGroup)
  }
}
