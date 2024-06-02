import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { ITutoringRepositoryToken } from '@business/repositories/tutoring/iTutoringRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { FindAllTutoringsUseCase } from '@business/useCases/tutoring/findAllTutoring'
import { FindAllTutoringsOperator } from '@controller/operations/tutoring/findAll'
import { InputFindAllTutorings } from '@controller/serializers/tutoring/findAll'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeTutoringEntity } from '@tests/mock/entities/fakeTutoringEntity'
import { FakeTutoringRepository } from '@tests/mock/repositories/fakeTutoringRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Find all Tutorings Operator', () => {
  beforeAll(() => {
    container.bind(FindAllTutoringsUseCase).toSelf().inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(ITutoringRepositoryToken)
      .to(FakeTutoringRepository)
      .inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputFindAllTutorings({
    contains: [],
  })

  test('Should fail to find all tutorings if find all use case failed', async () => {
    const findAllTutorings = container.get(FindAllTutoringsUseCase)
    jest
      .spyOn(findAllTutorings, 'exec')
      .mockImplementationOnce(async () => left(TutoringErrors.loadFailed()))

    const sut = container.get(FindAllTutoringsOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TutoringErrors.loadFailed())
  })

  test('Should have success to find all tutorings', async () => {
    const findAllTutorings = container.get(FindAllTutoringsUseCase)
    jest.spyOn(findAllTutorings, 'exec').mockImplementationOnce(async () =>
      right({
        count: 1,
        items: [fakeTutoringEntity],
        page: 0,
        perPage: 10,
      })
    )

    const sut = container.get(FindAllTutoringsOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
