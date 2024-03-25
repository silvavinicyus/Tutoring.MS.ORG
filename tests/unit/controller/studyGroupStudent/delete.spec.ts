import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupStudentRepositoryToken } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { DeleteStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/deleteStudyGroupStudent'
import { FindByStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/findByStudyGroupStudent'
import { DeleteStudyGroupStudentOperator } from '@controller/operations/studyGroupStudent/delete'
import { InputDeleteStudyGroupStudent } from '@controller/serializers/studyGroupStudent/delete'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeStudyGroupStudentEntity } from '@tests/mock/entities/fakeStudyGroupStudentEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeStudyGroupStudentRepository } from '@tests/mock/repositories/fakeStudyGroupStudentRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Delete Study Group Student Operator', () => {
  beforeAll(() => {
    container.bind(DeleteStudyGroupStudentUseCase).toSelf().inSingletonScope()
    container.bind(FindByStudyGroupStudentUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupStudentRepositoryToken)
      .to(FakeStudyGroupStudentRepository)
      .inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputDeleteStudyGroupStudent({
    uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  })

  test('Should fail to delete a study group student if student was not found', async () => {
    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.notFound())
      )

    const sut = container.get(DeleteStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.notFound())
  })

  test('Should fail to delete a study group student if study group was not found', async () => {
    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(DeleteStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to delete a study group student if authorizer aint a leader ou group creator', async () => {
    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () =>
        right({ ...fakeStudyGroupEntity, creator_id: 2, leaders: [] })
      )

    const sut = container.get(DeleteStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to delete a study group student if delete student failed', async () => {
    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () =>
        right({ ...fakeStudyGroupEntity, creator_id: 1, leaders: [] })
      )

    const deleteStudent = container.get(DeleteStudyGroupStudentUseCase)
    jest
      .spyOn(deleteStudent, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.deleteFailed())
      )

    const sut = container.get(DeleteStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.deleteFailed())
  })

  test('Should have success to delete a study group student', async () => {
    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findStudyGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [fakeUserEntity],
      })
    )

    const deleteStudent = container.get(DeleteStudyGroupStudentUseCase)
    jest
      .spyOn(deleteStudent, 'exec')
      .mockImplementationOnce(async () => right(void 0))

    const sut = container.get(DeleteStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
