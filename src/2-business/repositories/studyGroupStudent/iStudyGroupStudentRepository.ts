import { IInputDeleteStudyGroupStudentDto } from '@business/dto/studyGroupStudent/delete'
import { IInputFindAllStudyGroupStudentsDto } from '@business/dto/studyGroupStudent/findAll'
import { IInputFindByStudyGroupStudentDto } from '@business/dto/studyGroupStudent/findBy'
import { ITransaction } from '@business/dto/transaction/create'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupStudentsEntity } from '@domain/entities/studyGroupStudents'
import { IUserEntity } from '@domain/entities/user'

export const IStudyGroupStudentRepositoryToken = Symbol.for(
  'StudyGroupStudentRepositorySymbol'
)

export interface IStudyGroupStudentRepository {
  create(
    input: IStudyGroupStudentsEntity,
    trx?: ITransaction
  ): Promise<IStudyGroupStudentsEntity>
  findBy(
    input: IInputFindByStudyGroupStudentDto
  ): Promise<IStudyGroupStudentsEntity>
  findAll(
    input: IInputFindAllStudyGroupStudentsDto
  ): Promise<IPaginatedResponse<IUserEntity>>
  delete(
    input: IInputDeleteStudyGroupStudentDto,
    trx?: ITransaction
  ): Promise<void>
}
