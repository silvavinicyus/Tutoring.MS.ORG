import { FindAllTutoringsUseCase } from '@business/useCases/tutoring/findAllTutoring'
import { IInputCreateTutoringDto } from '@business/dto/tutoring/create'
import { IInputDeleteTutoringDto } from '@business/dto/tutoring/delete'
import { IInputFindAllTutoringsDto } from '@business/dto/tutoring/findAll'
import { IInputFindByTutoringDto } from '@business/dto/tutoring/findBy'
import { IInputUpdateTutoringDto } from '@business/dto/tutoring/update'
import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { ITutoringRepositoryToken } from '@business/repositories/tutoring/iTutoringRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateTutoringUseCase } from '@business/useCases/tutoring/createTutoring'
import { DeleteTutoringUseCase } from '@business/useCases/tutoring/deleteTutoring'
import { FindByTutoringUseCase } from '@business/useCases/tutoring/findByTutoring'
import { UpdateTutoringUseCase } from '@business/useCases/tutoring/updateTutoring'
import { container } from '@shared/ioc/container'
import { fakeTutoringEntity } from '@tests/mock/entities/fakeTutoringEntity'
import {
  FakeTutoringRepository,
  fakeTutoringRepositoryCreate,
  fakeTutoringRepositoryDelete,
  fakeTutoringRepositoryFindAll,
  fakeTutoringRepositoryFindBy,
  fakeTutoringRepositoryUpdate,
} from '@tests/mock/repositories/fakeTutoringRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Tutoring Use Cases', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(ITutoringRepositoryToken).to(FakeTutoringRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('Create Tutoring Use Case', () => {
    const input: IInputCreateTutoringDto = {
      date: new Date(),
      student_id: 1,
      subject: 'subject',
      tutor_id: 1,
    }

    test('Should fail to create a tutoring if repository failed', async () => {
      fakeTutoringRepositoryCreate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreateTutoringUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(TutoringErrors.creationError())
    })

    test('Should have success to create a tutoring', async () => {
      fakeTutoringRepositoryCreate.mockImplementationOnce(
        async () => fakeTutoringEntity
      )

      const sut = container.get(CreateTutoringUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Delete Tutoring Use Case', () => {
    const input: IInputDeleteTutoringDto = {
      id: 1,
    }

    test('Should fail to delete a tutoring if repository failed', async () => {
      fakeTutoringRepositoryDelete.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(DeleteTutoringUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(TutoringErrors.deleteFailed())
    })

    test('Should have success to delete a tutoring', async () => {
      fakeTutoringRepositoryDelete.mockImplementationOnce(async () => void 0)

      const sut = container.get(DeleteTutoringUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Find By Tutoring Use Case', () => {
    const input: IInputFindByTutoringDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find by a tutoring if repository failed', async () => {
      fakeTutoringRepositoryFindBy.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindByTutoringUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(TutoringErrors.loadFailed())
    })

    test('Should fail to find by a tutoring if tutoring does not exists', async () => {
      fakeTutoringRepositoryFindBy.mockImplementationOnce(async () => undefined)

      const sut = container.get(FindByTutoringUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(TutoringErrors.notFound())
    })

    test('Should have success to find by a tutoring', async () => {
      fakeTutoringRepositoryFindBy.mockImplementationOnce(
        async () => fakeTutoringEntity
      )

      const sut = container.get(FindByTutoringUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Find All Tutorings Use Case', () => {
    const input: IInputFindAllTutoringsDto = {
      where: [
        {
          column: 'id',
          value: 1,
        },
      ],
    }

    test('Should fail to find all tutorings if repository failed', async () => {
      fakeTutoringRepositoryFindAll.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(FindAllTutoringsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(TutoringErrors.loadFailed())
    })

    test('Should have success to find all tutorings', async () => {
      fakeTutoringRepositoryFindAll.mockImplementationOnce(async () => ({
        count: 1,
        items: [fakeTutoringEntity],
        page: 0,
        perPage: 10,
      }))

      const sut = container.get(FindAllTutoringsUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Update Tutoring Use Case', () => {
    const input: IInputUpdateTutoringDto = {
      date: new Date(),
    }

    test('Should fail to update a tutoring if repository failed', async () => {
      fakeTutoringRepositoryUpdate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(UpdateTutoringUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(TutoringErrors.updateError())
    })

    test('Should fail to update a tutoring if repository returned empty', async () => {
      fakeTutoringRepositoryUpdate.mockImplementationOnce(async () => undefined)

      const sut = container.get(UpdateTutoringUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(TutoringErrors.updateError())
    })

    test('Should have success to update a tutoring', async () => {
      fakeTutoringRepositoryUpdate.mockImplementationOnce(
        async () => fakeTutoringEntity
      )

      const sut = container.get(UpdateTutoringUseCase)
      const result = await sut.exec(input, { column: 'id', value: 1 })

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
