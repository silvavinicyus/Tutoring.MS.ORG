import { ITimestamps } from '@domain/timestamps'
import { AbstractEntity } from '@domain/abstractEntity'
import { Right, right } from '@shared/either'
import { IStudyGroupEntity } from './studyGroup'
import { IUserEntity } from './user'

interface IPostRelations {
  owner: IUserEntity
  group: IStudyGroupEntity
}

export interface IPostEntity extends ITimestamps, Partial<IPostRelations> {
  id: number
  uuid: string
  title: string
  content: string
  image_id: number
  group_id: number
  owner_id: number
  fixed: boolean
}

export type IInputPostEntity = Pick<
  IPostEntity,
  'title' | 'content' | 'image_id' | 'group_id' | 'owner_id' | 'fixed'
>

export class PostEntity extends AbstractEntity<IPostEntity> {
  static create(
    props: IInputPostEntity,
    currentDate: Date
  ): Right<void, PostEntity> {
    const post = new PostEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })

    return right(post)
  }

  static update(
    props: Partial<IPostEntity>,
    currentDate: Date
  ): Right<void, PostEntity> {
    const post = new PostEntity({
      ...props,
      updated_at: currentDate,
    } as IPostEntity)

    return right(post)
  }
}
