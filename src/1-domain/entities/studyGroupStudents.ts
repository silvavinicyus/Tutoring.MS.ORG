import { ITimestamps } from '@domain/timestamps'
import { AbstractEntity } from '@domain/abstractEntity'
import { Right, right } from '@shared/either'
import { IStudyGroupEntity } from './studyGroup'
import { IUserEntity } from './user'

interface IStudyGroupStudentsRelations {
  student: IUserEntity
  group: IStudyGroupEntity
}

export interface IStudyGroupStudentsEntity
  extends ITimestamps,
    Partial<IStudyGroupStudentsRelations> {
  id: number
  uuid: string
  student_id: number
  group_id: number
}

export type IInputStudyGroupStudentEntity = Pick<
  IStudyGroupStudentsEntity,
  'group_id' | 'student_id'
>

export class StudyGroupStudentEntity extends AbstractEntity<IStudyGroupStudentsEntity> {
  static create(
    props: IInputStudyGroupStudentEntity,
    currentDate: Date
  ): Right<void, StudyGroupStudentEntity> {
    const post = new StudyGroupStudentEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })

    return right(post)
  }
}
