import { StudyGroupEntity } from '@domain/entities/studyGroup'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'

describe('Study Group  Entity', () => {
  describe('Create Method', () => {
    test('Should be able to create a new studyGroup  entity', () => {
      const studyGroupEntity = StudyGroupEntity.create(
        fakeStudyGroupEntity,
        new Date()
      )

      expect(studyGroupEntity.isLeft()).toBeFalsy()
      expect(studyGroupEntity.isRight()).toBeTruthy()
    })
  })

  describe('Update Method', () => {
    test('Should be able to update a studyGroup  entity', () => {
      const studyGroupUpdateData = {
        ...fakeStudyGroupEntity,
        name: 'new name',
        subject: 'new subject',
      }

      const studyGroupEntity = StudyGroupEntity.update(
        studyGroupUpdateData,
        new Date()
      )

      expect(studyGroupEntity.isLeft()).toBeFalsy()
      expect(studyGroupEntity.isRight()).toBeTruthy()
    })
  })
})
