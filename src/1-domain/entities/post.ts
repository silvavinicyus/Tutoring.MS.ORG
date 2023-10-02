import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { Right, right } from '@shared/either'
import { IPostReactionEntity } from './postReactions'
import { IUserEntity } from './user'

interface IPostRelations {
  owner: IUserEntity
  reactions: IPostReactionEntity[]
}

export interface IPostEntity extends ITimestamps, Partial<IPostRelations> {
  id: number
  uuid: string
  title: string
  content: string
  image_id?: number
  group_id: number
  owner_id: number
  fixed: boolean
}

export type IInputPostEntity = Pick<
  IPostEntity,
  'title' | 'content' | 'image_id' | 'group_id' | 'owner_id' | 'fixed'
>

export type PostEntityKeys = Pick<
  IPostEntity,
  'owner_id' | 'group_id' | 'id' | 'uuid'
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
