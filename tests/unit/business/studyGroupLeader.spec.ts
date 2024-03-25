import { IInputCreateStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/create'
import { IInputDeleteStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/delete'
import { IInputFindAllStudyGroupLeadersDto } from '@business/dto/studyGroupLeader/findAll'
import { IInputFindByStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/findBy'
import { StudyGroupLeaderErrors } from '@business/module/errors/studyGroupLeaderErrors'
import { IStudyGroupLeaderRepositoryToken } from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/createStudyGroupLeader'
import { DeleteStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/deleteStudyGroupLeader'
import { FindAllStudyGroupLeadersUseCase } from '@business/useCases/studyGroupLeader/findAllStudyGroupLeaders'
import { FindByStudyGroupLeaderUseCase } from '@business/useCases/studyGroupLeader/findByStudyGroupLeader'
import { container } from '@shared/ioc/container'
import { fakeStudyGroupLeaderEntity } from '@tests/mock/entities/fakeStudyGroupLeaderEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import {
  FakeStudyGroupLeaderRepository,
  fakeStudyGroupLeaderRepositoryCreate,
  fakeStudyGroupLeaderRepositoryDelete,
  fakeStudyGroupLeaderRepositoryFindAll,
  fakeStudyGroupLeaderRepositoryFindBy,
} from '@tests/mock/repositories/fakeStudyGroupLeaderRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Study Group Leader Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container
      .bind(IStudyGroupLeaderRepositoryToken)
      .to(FakeStudyGroupLeaderRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Create Study Group Leader use case', () => {
    const input: IInputCreateStudyGroupLeaderDto = {
      group_id: 1,
      leader_id: 1,
    }

    test('Should fail to create a study group leader if repository failed', async () => {
      fakeStudyGroupLeaderRepositoryCreate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreateStudyGroupLeaderUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupLeaderErrors.creationError())
    })

    test('Should have success to create a study group leader', async () => {
      fakeStudyGroupLeaderRepositoryCreate.mockImplementationOnce(
        async () => fakeStudyGroupLeaderEntity
      )

      const sut = container.get(CreateStudyGroupLeaderUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete Study Group Leader use case', () => {
    const input: IInputDeleteStudyGroupLeaderDto = {
      id: 1,
    }

    test('Should fail to delete a study group leader if repository failed', async () => {
      fakeStudyGroupLeaderRepositoryDelete.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeleteStudyGroupLeaderUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupLeaderErrors.deleteFailed())
    })

    test('Should have success to delete a study group leader', async () => {
      fakeStudyGroupLeaderRepositoryDelete.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(DeleteStudyGroupLeaderUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindBy Study Group Leader use case', () => {
    const input: IInputFindByStudyGroupLeaderDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find by a study group leader if repository failed', async () => {
      fakeStudyGroupLeaderRepositoryFindBy.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindByStudyGroupLeaderUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupLeaderErrors.loadFailed())
    })

    test('Should fail to find by a study group leader if leader does not exists', async () => {
      fakeStudyGroupLeaderRepositoryFindBy.mockImplementationOnce(
        async () => undefined
      )

      const sut = container.get(FindByStudyGroupLeaderUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupLeaderErrors.notFound())
    })

    test('Should have success to find by a study group leader', async () => {
      fakeStudyGroupLeaderRepositoryFindBy.mockImplementationOnce(
        async () => fakeStudyGroupLeaderEntity
      )

      const sut = container.get(FindByStudyGroupLeaderUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindAll Study Group Leader use case', () => {
    const input: IInputFindAllStudyGroupLeadersDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find all study group leaders if repository failed', async () => {
      fakeStudyGroupLeaderRepositoryFindAll.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindAllStudyGroupLeadersUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupLeaderErrors.loadFailed())
    })

    test('Should have success to find all a study group leaders', async () => {
      fakeStudyGroupLeaderRepositoryFindAll.mockImplementationOnce(
        async () => ({
          count: 1,
          perPage: 10,
          page: 0,
          items: [fakeUserEntity],
        })
      )

      const sut = container.get(FindAllStudyGroupLeadersUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
