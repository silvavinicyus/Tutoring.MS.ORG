import { ITimestamps } from '@domain/timestamps'
import { AbstractEntity } from '@domain/abstractEntity'
import { Right, right } from '@shared/either'
import { IPostEntity } from './post'
import { IUserEntity } from './user'

interface IPostReactionRelations {
  post: IPostEntity
  user: IUserEntity
}

export enum PostReactionTypes {
  LIKE = 'like',
  LOVE = 'love',
  DISLIKE = 'dislike',
  HAHA = 'haha',
}

export type IInputPostReactionEntity = Pick<
  IPostReactionEntity,
  'type' | 'post_id' | 'user_id'
>

export type PostReactionEntityKeys = Pick<
  IPostReactionEntity,
  'id' | 'uuid' | 'post_id' | 'type'
>

export interface IPostReactionEntity
  extends ITimestamps,
    Partial<IPostReactionRelations> {
  id: number
  uuid: string
  type: PostReactionTypes
  post_id: number
  user_id: number
}

export class PostReactionEntity extends AbstractEntity<IPostReactionEntity> {
  static create(
    props: IInputPostReactionEntity,
    currentDate: Date
  ): Right<void, PostReactionEntity> {
    const postReaction = new PostReactionEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })
    return right(postReaction)
  }

  static update(
    props: Partial<IPostReactionEntity>,
    currentDate: Date
  ): Right<void, PostReactionEntity> {
    const postReaction = new PostReactionEntity({
      ...props,
      updated_at: currentDate,
    } as IPostReactionEntity)

    return right(postReaction)
  }
}
