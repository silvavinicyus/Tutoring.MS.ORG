import { StudyGroupLeaderEntity } from '@domain/entities/studyGroupLeader'
import { fakeStudyGroupLeaderEntity } from '@tests/mock/entities/fakeStudyGroupLeaderEntity'

describe('Study Group Leader Entity', () => {
  describe('Create Method', () => {
    test('Should be able to create a new study Group Leader  entity', () => {
      const studyGroupLeaderEntity = StudyGroupLeaderEntity.create(
        fakeStudyGroupLeaderEntity,
        new Date()
      )

      expect(studyGroupLeaderEntity.isLeft()).toBeFalsy()
      expect(studyGroupLeaderEntity.isRight()).toBeTruthy()
    })
  })

  describe('Update Method', () => {
    test('Should be able to update a study Group Leader  entity', () => {
      const studyGroupLeaderUpdateData = {
        ...fakeStudyGroupLeaderEntity,
        leader_id: 1,
      }

      const studyGroupLeaderEntity = StudyGroupLeaderEntity.update(
        studyGroupLeaderUpdateData,
        new Date()
      )

      expect(studyGroupLeaderEntity.isLeft()).toBeFalsy()
      expect(studyGroupLeaderEntity.isRight()).toBeTruthy()
    })
  })
})
