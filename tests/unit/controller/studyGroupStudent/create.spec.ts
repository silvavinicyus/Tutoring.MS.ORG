import { RolesErrors } from '@business/module/errors/rolesErrors'
import { StudyGroupErrors } from '@business/module/errors/studyGroupErrors'
import { StudyGroupStudentErrors } from '@business/module/errors/studyGroupStudentErrors'
import { UserErrors } from '@business/module/errors/userErrors'
import { IStudyGroupRepositoryToken } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IStudyGroupStudentRepositoryToken } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { VerifyProfileUseCase } from '@business/useCases/role/verifyProfile'
import { FindStudyGroupByUseCase } from '@business/useCases/studyGroup/findByStudyGroup'
import { CreateStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/createStudyGroupStudent'
import { FindByStudyGroupStudentUseCase } from '@business/useCases/studyGroupStudent/findByStudyGroupStudent'
import { FindByUserUseCase } from '@business/useCases/user/findByUser'
import { CreateStudyGroupStudentOperator } from '@controller/operations/studyGroupStudent/create'
import { InputCreateStudyGroupStudent } from '@controller/serializers/studyGroupStudent/create'
import { left, right } from '@shared/either'
import { container } from '@shared/ioc/container'
import { fakeAuthorizer } from '@tests/mock/entities/fakeAuthorizerEntity'
import { fakeStudyGroupEntity } from '@tests/mock/entities/fakeStudyGroupEntity'
import { fakeStudyGroupStudentEntity } from '@tests/mock/entities/fakeStudyGroupStudentEntity'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'
import { FakeStudyGroupRepository } from '@tests/mock/repositories/fakeStudyGroupRepository'
import { FakeStudyGroupStudentRepository } from '@tests/mock/repositories/fakeStudyGroupStudentRepository'
import { FakeUserRepository } from '@tests/mock/repositories/fakeUserRepository'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import { FakeUniqueIdentifierService } from '@tests/mock/services/fakeUniqueIdentifierService'

describe('Create Study Group Student Operator', () => {
  beforeAll(() => {
    container.bind(CreateStudyGroupStudentUseCase).toSelf().inSingletonScope()
    container.bind(FindStudyGroupByUseCase).toSelf().inSingletonScope()
    container.bind(FindByUserUseCase).toSelf().inSingletonScope()
    container.bind(FindByStudyGroupStudentUseCase).toSelf().inSingletonScope()
    container.bind(VerifyProfileUseCase).toSelf().inSingletonScope()
    container
      .bind(IStudyGroupRepositoryToken)
      .to(FakeStudyGroupRepository)
      .inSingletonScope()
    container
      .bind(IStudyGroupStudentRepositoryToken)
      .to(FakeStudyGroupStudentRepository)
      .inSingletonScope()
    container
      .bind(IUserRepositoryToken)
      .to(FakeUserRepository)
      .inSingletonScope()
    container.bind(ILoggerServiceToken).to(FakeLoggerService).inSingletonScope()
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
      .inSingletonScope()
  })

  afterAll(() => {
    container.unbindAll()
  })

  const input = new InputCreateStudyGroupStudent({
    group_uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
    student_uuid: 'ccaddbfd-db88-471f-91ae-4aa04609facb',
  })

  test('Should fail to create a study group student if user aint authorized', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => left(RolesErrors.notAllowed()))

    const sut = container.get(CreateStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to create a study group student if group does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest
      .spyOn(findStudyGroup, 'exec')
      .mockImplementationOnce(async () => left(StudyGroupErrors.notFound()))

    const sut = container.get(CreateStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupErrors.notFound())
  })

  test('Should fail to create a study group student if authorizer aint group creator or leader', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findStudyGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 2,
        leaders: [{ ...fakeUserEntity, id: 3 }],
      })
    )

    const sut = container.get(CreateStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(RolesErrors.notAllowed())
  })

  test('Should fail to create a study group student if student does not exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findStudyGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [fakeUserEntity],
      })
    )

    const findUser = container.get(FindByUserUseCase)
    jest
      .spyOn(findUser, 'exec')
      .mockImplementationOnce(async () => left(UserErrors.notFound()))

    const sut = container.get(CreateStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(UserErrors.notFound())
  })

  test('Should fail to create a study group student if student search failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findStudyGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [fakeUserEntity],
      })
    )

    const findUsers = container.get(FindByUserUseCase)
    jest
      .spyOn(findUsers, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.loadFailed())
      )

    const sut = container.get(CreateStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.loadFailed())
  })

  test('Should fail to create a study group student if student already exists', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findStudyGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [fakeUserEntity],
      })
    )

    const findUsers = container.get(FindByUserUseCase)
    jest
      .spyOn(findUsers, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const sut = container.get(CreateStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.alreadyExists())
  })

  test('Should fail to create a study group student if student creation failed', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findStudyGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [fakeUserEntity],
      })
    )

    const findUsers = container.get(FindByUserUseCase)
    jest
      .spyOn(findUsers, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.notFound())
      )

    const createStudent = container.get(CreateStudyGroupStudentUseCase)
    jest
      .spyOn(createStudent, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.creationError())
      )

    const sut = container.get(CreateStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
    expect(result.value).toEqual(StudyGroupStudentErrors.creationError())
  })

  test('Should have success to create a study group student', async () => {
    const verifyProfile = container.get(VerifyProfileUseCase)
    jest
      .spyOn(verifyProfile, 'exec')
      .mockImplementationOnce(async () => right(fakeAuthorizer))

    const findStudyGroup = container.get(FindStudyGroupByUseCase)
    jest.spyOn(findStudyGroup, 'exec').mockImplementationOnce(async () =>
      right({
        ...fakeStudyGroupEntity,
        creator_id: 1,
        leaders: [fakeUserEntity],
      })
    )

    const findUsers = container.get(FindByUserUseCase)
    jest
      .spyOn(findUsers, 'exec')
      .mockImplementationOnce(async () => right(fakeUserEntity))

    const findStudent = container.get(FindByStudyGroupStudentUseCase)
    jest
      .spyOn(findStudent, 'exec')
      .mockImplementationOnce(async () =>
        left(StudyGroupStudentErrors.notFound())
      )

    const createStudent = container.get(CreateStudyGroupStudentUseCase)
    jest
      .spyOn(createStudent, 'exec')
      .mockImplementationOnce(async () => right(fakeStudyGroupStudentEntity))

    const sut = container.get(CreateStudyGroupStudentOperator)
    const result = await sut.run(input, fakeAuthorizer)

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })
})
