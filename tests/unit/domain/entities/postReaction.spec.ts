import {
  PostReactionEntity,
  PostReactionTypes,
} from '@domain/entities/postReactions'
import { fakePostReactionEntity } from '@tests/mock/entities/fakePostReactionEntity'

describe('Post Reaction Entity', () => {
  describe('Create Method', () => {
    test('Should be able to create a new post reaction entity', () => {
      const postReactionEntity = PostReactionEntity.create(
        fakePostReactionEntity,
        new Date()
      )

      expect(postReactionEntity.isLeft()).toBeFalsy()
      expect(postReactionEntity.isRight()).toBeTruthy()
    })
  })

  describe('Update Method', () => {
    test('Should be able to update a  post reaction entity', () => {
      const postReactionUpdateData = {
        ...fakePostReactionEntity,
        type: PostReactionTypes.DISLIKE,
      }

      const postReactionEntity = PostReactionEntity.update(
        postReactionUpdateData,
        new Date()
      )

      expect(postReactionEntity.isLeft()).toBeFalsy()
      expect(postReactionEntity.isRight()).toBeTruthy()
    })
  })
})
