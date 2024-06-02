import { TutoringEntity } from '@domain/entities/tutoring'
import { fakeTutoringEntity } from '@tests/mock/entities/fakeTutoringEntity'

describe('Tutoring Entity', () => {
  describe('Create Method', () => {
    test('Should be able to create a new tutoring entity', () => {
      const tutoringEntity = TutoringEntity.create(
        fakeTutoringEntity,
        new Date()
      )

      expect(tutoringEntity.isLeft()).toBeFalsy()
      expect(tutoringEntity.isRight()).toBeTruthy()
    })
  })

  describe('Update Method', () => {
    test('Should be able to update a tutoring entity', () => {
      const tutoringUpdateData = {
        ...fakeTutoringEntity,
        subject: 'new subject',
      }

      const tutoringEntityUpdated = TutoringEntity.update(
        tutoringUpdateData,
        new Date()
      )

      expect(tutoringEntityUpdated.isLeft()).toBeFalsy()
      expect(tutoringEntityUpdated.isRight()).toBeTruthy()
    })
  })
})
