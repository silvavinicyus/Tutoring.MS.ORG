import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { ITutoringRepositoryToken } from '@business/repositories/tutoring/iTutoringRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { FindByTutoringUseCase } from '@business/useCases/tutoring/findByTutoring'
import { FindTutoringByOperator } from '@controller/operations/tutoring/findBy'
import { InputFindByTutoring } from '@controller/serializers/tutoring/findBy'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeTutoringEntity } from '@tests/mock/entities/fakeTutoringEntity'
import { FakeTutoringRepository } from '@tests/mock/repositories/fakeTutoringRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Find by Tutoring Operator', () => {
  beforeAll(() => {
    container.bind(FindByTutoringUseCase).toSelf().inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(ITutoringRepositoryToken)
      .to(FakeTutoringRepository)
      .inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputFindByTutoring({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to find by tutorings if find by use case failed', async () => {
    const findByTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findByTutoring, 'exec')
      .mockImplementationOnce(async () => left(TutoringErrors.loadFailed()))

    const sut = container.get(FindTutoringByOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TutoringErrors.loadFailed())
  })

  test('Should have success to find by tutorings', async () => {
    const findByTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findByTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const sut = container.get(FindTutoringByOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
