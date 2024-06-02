import { IInputCreateStudyGroupDto } from '@business/dto/studyGroup/create'
import { IInputDeleteStudyGroupDto } from '@business/dto/studyGroup/delete'
import { IInputFindAllStudyGroupsDto } from '@business/dto/studyGroup/findAll'
import { IInputFindStudyGroupByDto } from '@business/dto/studyGroup/findBy'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateStudyGroupUseCase } from '@business/useCases/studyGroup/createStudyGroup'
import { DeleteStudyGroupUseCase } from '@business/useCases/studyGroup/deleteStudyGroup'
import { FindAllStudyGroupsUseCase } from '@business/useCases/studyGroup/findAllStudyGroups'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { container } from '@shared/ioc/container'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import {
  FakeStudyGroupRepository,
  fakeStudyGroupRepositoryCreate,
  fakeStudyGroupRepositoryDelete,
  fakeStudyGroupRepositoryFindAll,
  fakeStudyGroupRepositoryFindBy,
} from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Study Group Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(IStudyGroupRepositoryToken).to(FakeStudyGroupRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Create study group use case', () => {
    const input: IInputCreateStudyGroupDto = {
      creator_id: 1,
      name: 'name',
      subject: 'subject',
    }

    test('Should fail to create a study group if repository failed', async () => {
      fakeStudyGroupRepositoryCreate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreateStudyGroupUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupErrors.creationError())
    })

    test('Should have success to create a study group', async () => {
      fakeStudyGroupRepositoryCreate.mockImplementationOnce(
        async () => fakeStudyGroupEntity
      )

      const sut = container.get(CreateStudyGroupUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete study group use case', () => {
    const input: IInputDeleteStudyGroupDto = {
      id: 1,
    }

    test('Should fail to delete a study group if repository failed', async () => {
      fakeStudyGroupRepositoryDelete.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeleteStudyGroupUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupErrors.deleteFailed())
    })

    test('Should have success to delete a study group', async () => {
      fakeStudyGroupRepositoryDelete.mockImplementationOnce(async () => void 0)

      const sut = container.get(DeleteStudyGroupUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindAll study group use case', () => {
    const input: IInputFindAllStudyGroupsDto = {}

    test('Should fail to find all study groups if repository failed', async () => {
      fakeStudyGroupRepositoryFindAll.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindAllStudyGroupsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupErrors.loadFailed())
    })

    test('Should have success to find all study groups', async () => {
      fakeStudyGroupRepositoryFindAll.mockImplementationOnce(async () => ({
        count: 1,
        items: [fakeStudyGroupEntity],
        page: 0,
        perPage: 10,
      }))

      const sut = container.get(FindAllStudyGroupsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindBy study group use case', () => {
    const input: IInputFindStudyGroupByDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find By a study group if repository failed', async () => {
      fakeStudyGroupRepositoryFindBy.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindStudyGroupByUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupErrors.loadFailed())
    })

    test('Should fail to find By a study group if study group does not exists', async () => {
      fakeStudyGroupRepositoryFindBy.mockImplementationOnce(
        async () => undefined
      )

      const sut = container.get(FindStudyGroupByUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupErrors.notFound())
    })

    test('Should have success to find By a study group', async () => {
      fakeStudyGroupRepositoryFindBy.mockImplementationOnce(
        async () => fakeStudyGroupEntity
      )

      const sut = container.get(FindStudyGroupByUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
