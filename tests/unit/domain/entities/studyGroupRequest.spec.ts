import { StudyGroupRequestEntity } from '@domain/entities/studyGroupRequest'
import { fakeStudyGroupRequestEntity } from '@tests/mock/entities/fakeStudyGroupRequestEntity'

describe('Study Group Request Entity', () => {
  describe('Create Method', () => {
    test('Should be able to create a new study Group Request  entity', () => {
      const studyGroupRequestEntity = StudyGroupRequestEntity.create(
        fakeStudyGroupRequestEntity,
        new Date()
      )

      expect(studyGroupRequestEntity.isLeft()).toBeFalsy()
      expect(studyGroupRequestEntity.isRight()).toBeTruthy()
    })
  })
})
