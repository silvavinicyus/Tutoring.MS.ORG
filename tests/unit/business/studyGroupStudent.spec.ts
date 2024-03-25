import { FindAllStudyGroupStudentsUseCase } from '@business/useCases/studyGroupStudent/findAllStudyGroupStudent'
import { IInputCreateStudyGroupStudentDto } from '@business/dto/studyGroupStudent/create'
import { IInputDeleteStudyGroupStudentDto } from '@business/dto/studyGroupStudent/delete'
import { IInputFindAllStudyGroupStudentsDto } from '@business/dto/studyGroupStudent/findAll'
import { IInputFindByStudyGroupStudentDto } from '@business/dto/studyGroupStudent/findBy'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { IStudyGroupStudentRepositoryToken } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/createStudyGroupStudent'
import { DeleteStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/deleteStudyGroupStudent'
import { FindByStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/findByStudyGroupStudent'
import { container } from '@shared/ioc/container'
import { fakeStudyGroupStudentEntity } from '@tests/mock/entities/fakeStudyGroupStudentEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import {
  FakeStudyGroupStudentRepository,
  fakeStudyGroupStudentRepositoryCreate,
  fakeStudyGroupStudentRepositoryDelete,
  fakeStudyGroupStudentRepositoryDeleteMany,
  fakeStudyGroupStudentRepositoryFindAll,
  fakeStudyGroupStudentRepositoryFindBy,
} from '@tests/mock/repositories/fakeStudyGroupStudentRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'
import { IInputDeleteManyGroupStudentsDto } from '@business/dto/studyGroupStudent/deleteMany'
import { DeleteManyStudyGroupStudentsUseCase } from '@business/useCases/studyGroupStudent/deleteManyStudyGroupStudents'

describe('Study Group Student Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container
      .bind(IStudyGroupStudentRepositoryToken)
      .to(FakeStudyGroupStudentRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Create Study Group Student use case', () => {
    const input: IInputCreateStudyGroupStudentDto = {
      group_id: 1,
      student_id: 1,
    }

    test('Should fail to create a study group student if repository failed', async () => {
      fakeStudyGroupStudentRepositoryCreate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreateStudyGroupStudentUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupStudentErrors.creationError())
    })

    test('Should have success to create a study group student', async () => {
      fakeStudyGroupStudentRepositoryCreate.mockImplementationOnce(
        async () => fakeStudyGroupStudentEntity
      )

      const sut = container.get(CreateStudyGroupStudentUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete Study Group Student use case', () => {
    const input: IInputDeleteStudyGroupStudentDto = {
      id: 1,
    }

    test('Should fail to delete a study group student if repository failed', async () => {
      fakeStudyGroupStudentRepositoryDelete.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeleteStudyGroupStudentUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupStudentErrors.deleteFailed())
    })

    test('Should have success to delete a study group student', async () => {
      fakeStudyGroupStudentRepositoryDelete.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(DeleteStudyGroupStudentUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindBy Study Group Student use case', () => {
    const input: IInputFindByStudyGroupStudentDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find by a study group student if repository failed', async () => {
      fakeStudyGroupStudentRepositoryFindBy.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindByStudyGroupStudentUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupStudentErrors.loadFailed())
    })

    test('Should fail to find by a study group student if student does not exists', async () => {
      fakeStudyGroupStudentRepositoryFindBy.mockImplementationOnce(
        async () => undefined
      )

      const sut = container.get(FindByStudyGroupStudentUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupStudentErrors.notFound())
    })

    test('Should have success to find by a study group student', async () => {
      fakeStudyGroupStudentRepositoryFindBy.mockImplementationOnce(
        async () => fakeStudyGroupStudentEntity
      )

      const sut = container.get(FindByStudyGroupStudentUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindAll Study Group Student use case', () => {
    const input: IInputFindAllStudyGroupStudentsDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find all study group students if repository failed', async () => {
      fakeStudyGroupStudentRepositoryFindAll.mockImplementationOnce(
        async () => {
          throw new Error()
        }
      )

      const sut = container.get(FindAllStudyGroupStudentsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupStudentErrors.loadFailed())
    })

    test('Should have success to find all a study group students', async () => {
      fakeStudyGroupStudentRepositoryFindAll.mockImplementationOnce(
        async () => ({
          count: 1,
          perPage: 10,
          page: 0,
          items: [fakeUserEntity],
        })
      )

      const sut = container.get(FindAllStudyGroupStudentsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete Many Study Group Students use case', () => {
    const input: IInputDeleteManyGroupStudentsDto = {
      group_id: 1,
      students_ids: [1, 2, 3],
    }

    test('Should fail to delete many study group students if repository failed', async () => {
      fakeStudyGroupStudentRepositoryDeleteMany.mockImplementationOnce(
        async () => {
          throw new Error()
        }
      )

      const sut = container.get(DeleteManyStudyGroupStudentsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupStudentErrors.deleteFailed())
    })

    test('Should have success to delete many study group students', async () => {
      fakeStudyGroupStudentRepositoryDeleteMany.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(DeleteManyStudyGroupStudentsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
