import { StudyGroupStudentEntity } from '@domain/entities/studyGroupStudents'
import { fakeStudyGroupStudentEntity } from '@tests/mock/entities/fakeStudyGroupStudentEntity'

describe('Study Group Student Entity', () => {
  describe('Create Method', () => {
    test('Should be able to create a new study Group Student  entity', () => {
      const studyGroupStudentEntity = StudyGroupStudentEntity.create(
        fakeStudyGroupStudentEntity,
        new Date()
      )

      expect(studyGroupStudentEntity.isLeft()).toBeFalsy()
      expect(studyGroupStudentEntity.isRight()).toBeTruthy()
    })
  })
})
