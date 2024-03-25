import {
  IPostReactionEntity,
  PostReactionTypes,
} from '@domain/entities/postReactions'

export const fakePostReactionEntity: IPostReactionEntity = {
  id: 1,
  uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  created_at: new Date(),
  updated_at: new Date(),
  post_id: 1,
  type: PostReactionTypes.LIKE,
  user_id: 1,
}
