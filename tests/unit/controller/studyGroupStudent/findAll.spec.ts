import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupStudentRepositoryToken } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { FindAllStudyGroupStudentsUseCase } from '@business/useCases/studyGroupStudent/findAllStudyGroupStudent'
import { FindAllStudyGroupStudentsOperator } from '@controller/operations/studyGroupStudent/findAll'
import { InputFindAllStudyGroupStudents } from '@controller/serializers/studyGroupStudent/findAll'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeStudyGroupStudentRepository } from '@tests/mock/repositories/fakeStudyGroupStudentRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'

describe('Delete Study Group Student Operator', () => {
  beforeAll(() => {
    container.bind(FindAllStudyGroupStudentsUseCase).toSelf().inSingletonScope()
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

  const input = new InputFindAllStudyGroupStudents({
    group_uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
    contains: [],
  })

  test('Should fail to find all students if group was not found', async () => {
    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(FindAllStudyGroupStudentsOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to find all students if find all students failed', async () => {
    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findAllStudents = container.get(FindAllStudyGroupStudentsUseCase)
    jest
      .spyOn(findAllStudents, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.loadFailed())
      )

    const sut = container.get(FindAllStudyGroupStudentsOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.loadFailed())
  })

  test('Should have success to find all student', async () => {
    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupEntity))

    const findAllStudents = container.get(FindAllStudyGroupStudentsUseCase)
    jest.spyOn(findAllStudents, 'exec').mockImplementationOnce(async () =>
      right({
        count: 1,
        items: [fakeUserEntity],
        page: 0,
        perPage: 10,
      })
    )

    const sut = container.get(FindAllStudyGroupStudentsOperator)
    const result = await sut.run(input)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
