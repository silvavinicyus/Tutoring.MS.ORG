import { PostEntity } from '@domain/entities/post'
import { fakePostEntity } from '@tests/mock/entities/fakePostEntity'

describe('Post Entity', () => {
  describe('Create Method', () => {
    test('Should be able to create a new post entity', () => {
      const postEntity = PostEntity.create(fakePostEntity, new Date())

      expect(postEntity.isLeft()).toBeFalsy()
      expect(postEntity.isRight()).toBeTruthy()
    })
  })

  describe('Update Method', () => {
    test('Should be able to update a post entity', () => {
      const postUpdateData = {
        ...fakePostEntity,
        title: 'new title',
        content: 'new new content',
      }

      const postEntityUpdated = PostEntity.update(postUpdateData, new Date())

      expect(postEntityUpdated.isLeft()).toBeFalsy()
      expect(postEntityUpdated.isRight()).toBeTruthy()
    })
  })
})
