import { TutoringErrors } from '@business/module/errors/tutoringErrors'
import { ITransactionRepositoryToken } from '@business/repositories/transaction/iTransactionRepository'
import { ITutoringRepositoryToken } from '@business/repositories/tutoring/iTutoringRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { INotificationServiceToken } from '@business/services/notification/iNotificationService'
import { FindByTutoringUseCase } from '@business/useCases/tutoring/findByTutoring'
import { UpdateTutoringUseCase } from '@business/useCases/tutoring/updateTutoring'
import { UpdateTutoringOperator } from '@controller/operations/tutoring/update'
import { InputUpdateTutoring } from '@controller/serializers/tutoring/update'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeTutoringEntity } from '@tests/mock/entities/fakeTutoringEntity'
import { FakeTransactionRepository } from '@tests/mock/repositories/fakeTransactionRepository'
import { FakeTutoringRepository } from '@tests/mock/repositories/fakeTutoringRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeNotificationService } from '@tests/mock/services/fakeNotificationService'

describe('Find by Tutoring Operator', () => {
  beforeAll(() => {
    container.bind(UpdateTutoringUseCase).toSelf().inSingletonScope()
    container.bind(FindByTutoringUseCase).toSelf().inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(ITutoringRepositoryToken)
      .to(FakeTutoringRepository)
      .inSingletonScope()
    container.bind(INotificationServiceToken).to(FakeNotificationService)
    container.bind(ITransactionRepositoryToken).to(FakeTransactionRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputUpdateTutoring({
    date: new Date(),
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to update a tutoring if tutoring does not exists', async () => {
    const findTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findTutoring, 'exec')
      .mockImplementationOnce(async () => left(TutoringErrors.notFound()))

    const sut = container.get(UpdateTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TutoringErrors.notFound())
  })

  test('Should fail to update a tutoring if update failed', async () => {
    const findTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const updateTutoring = container.get(UpdateTutoringUseCase)
    jest
      .spyOn(updateTutoring, 'exec')
      .mockImplementationOnce(async () => left(TutoringErrors.updateError()))

    const sut = container.get(UpdateTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(TutoringErrors.updateError())
  })

  test('Should have success to update a tutoring', async () => {
    const findTutoring = container.get(FindByTutoringUseCase)
    jest
      .spyOn(findTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const updateTutoring = container.get(UpdateTutoringUseCase)
    jest
      .spyOn(updateTutoring, 'exec')
      .mockImplementationOnce(async () => right(fakeTutoringEntity))

    const sut = container.get(UpdateTutoringOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
