import { injectable } from 'inversify'
import { IStudyGroupStudentRepository } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { IInputDeleteStudyGroupStudentDto } from '@business/dto/studyGroupStudent/delete'
import { IInputDeleteManyGroupStudentsDto } from '@business/dto/studyGroupStudent/deleteMany'
import { IInputFindAllStudyGroupStudentsDto } from '@business/dto/studyGroupStudent/findAll'
import { IInputFindByStudyGroupStudentDto } from '@business/dto/studyGroupStudent/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupStudentsEntity } from '@domain/entities/studyGroupStudents'
import { IUserEntity } from '@domain/entities/user'

@injectable()
export class FakeStudyGroupStudentRepository
  implements IStudyGroupStudentRepository
{
  create(
    _input: IStudyGroupStudentsEntity
  ): Promise<IStudyGroupStudentsEntity> {
    return void 0
  }
  findBy(
    _input: IInputFindByStudyGroupStudentDto
  ): Promise<IStudyGroupStudentsEntity> {
    return void 0
  }
  findAll(
    _input: IInputFindAllStudyGroupStudentsDto
  ): Promise<IPaginatedResponse<IUserEntity>> {
    return void 0
  }
  delete(_input: IInputDeleteStudyGroupStudentDto): Promise<void> {
    return void 0
  }
  deleteMany(_input: IInputDeleteManyGroupStudentsDto): Promise<void> {
    return void 0
  }
}

export const fakeStudyGroupStudentRepositoryFindAll = jest.spyOn(
  FakeStudyGroupStudentRepository.prototype,
  'findAll'
)

export const fakeStudyGroupStudentRepositoryFindBy = jest.spyOn(
  FakeStudyGroupStudentRepository.prototype,
  'findBy'
)

export const fakeStudyGroupStudentRepositoryDelete = jest.spyOn(
  FakeStudyGroupStudentRepository.prototype,
  'delete'
)

export const fakeStudyGroupStudentRepositoryDeleteMany = jest.spyOn(
  FakeStudyGroupStudentRepository.prototype,
  'deleteMany'
)

export const fakeStudyGroupStudentRepositoryCreate = jest.spyOn(
  FakeStudyGroupStudentRepository.prototype,
  'create'
)
