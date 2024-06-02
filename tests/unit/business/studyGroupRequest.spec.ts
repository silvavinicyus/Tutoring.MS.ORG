import { FindByStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/findbyStudyGroupRequest'
import { IInputCreateStudyGroupRequestDto } from '@business/dto/studyGroupRequest/create'
import { IInputDeleteStudyGroupRequestDto } from '@business/dto/studyGroupRequest/delete'
import { IInputFindByStudyGroupRequestDto } from '@business/dto/studyGroupRequest/findBy'
import { StudyGroupRequestErrors } from '@business/module/errors/studyGroupRequestErrors'
import { IStudyGroupRequestRepositoryToken } from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/createStudyGroupRequest'
import { DeleteStudyGroupRequestUseCase } from '@business/useCases/studyGroupRequest/deleteStudyGroupRequest'
import { container } from '@shared/ioc/container'
import { fakeStudyGroupRequestEntity } from '@tests/mock/entities/fakeStudyGroupRequestEntity'
import {
  FakeStudyGroupRequestRepository,
  fakeStudyGroupRequestRepositoryCreate,
  fakeStudyGroupRequestRepositoryDelete,
  fakeStudyGroupRequestRepositoryFindBy,
} from '@tests/mock/repositories/fakeStudyGroupRequestRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Study Group Request Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container
      .bind(IStudyGroupRequestRepositoryToken)
      .to(FakeStudyGroupRequestRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Create Study Group Request use case', () => {
    const input: IInputCreateStudyGroupRequestDto = {
      group_id: 1,
      requester_id: 1,
    }

    test('Should fail to create a study group request if repository failed', async () => {
      fakeStudyGroupRequestRepositoryCreate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreateStudyGroupRequestUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupRequestErrors.creationError())
    })

    test('Should have success to create a study group request', async () => {
      fakeStudyGroupRequestRepositoryCreate.mockImplementationOnce(
        async () => fakeStudyGroupRequestEntity
      )

      const sut = container.get(CreateStudyGroupRequestUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete Study Group Request use case', () => {
    const input: IInputDeleteStudyGroupRequestDto = {
      uuid: 'uuid',
    }

    test('Should fail to delete a study group request if repository failed', async () => {
      fakeStudyGroupRequestRepositoryDelete.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeleteStudyGroupRequestUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupRequestErrors.deleteFailed())
    })

    test('Should have success to delete a study group request', async () => {
      fakeStudyGroupRequestRepositoryDelete.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(DeleteStudyGroupRequestUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('FindBy Study Group Request use case', () => {
    const input: IInputFindByStudyGroupRequestDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find by a study group request if repository failed', async () => {
      fakeStudyGroupRequestRepositoryFindBy.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindByStudyGroupRequestUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupRequestErrors.loadFailed())
    })

    test('Should fail to find by a study group request if request does not exists', async () => {
      fakeStudyGroupRequestRepositoryFindBy.mockImplementationOnce(
        async () => undefined
      )

      const sut = container.get(FindByStudyGroupRequestUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(StudyGroupRequestErrors.notFound())
    })

    test('Should have success to find by a study group request', async () => {
      fakeStudyGroupRequestRepositoryFindBy.mockImplementationOnce(
        async () => fakeStudyGroupRequestEntity
      )

      const sut = container.get(FindByStudyGroupRequestUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
