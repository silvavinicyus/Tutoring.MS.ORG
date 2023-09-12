import { IInputDeleteStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/delete'
import { IInputFindAllStudyGroupLeadersDto } from '@business/dto/studyGroupLeader/findAll'
import { IInputFindByStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/findBy'
import { ITransaction } from '@business/dto/transaction/create'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupLeaderEntity } from '@domain/entities/studyGroupLeader'

export const IStudyGroupLeaderRepositoryToken = Symbol.for(
  'StudyGroupLeaderRepositorySymbol'
)

export interface IStudyGroupLeaderRepository {
  create(
    input: IStudyGroupLeaderEntity,
    trx?: ITransaction
  ): Promise<IStudyGroupLeaderEntity>
  findBy(
    input: IInputFindByStudyGroupLeaderDto
  ): Promise<IStudyGroupLeaderEntity>
  findAll(
    input: IInputFindAllStudyGroupLeadersDto
  ): Promise<IPaginatedResponse<IStudyGroupLeaderEntity>>
  delete(
    input: IInputDeleteStudyGroupLeaderDto,
    trx?: ITransaction
  ): Promise<void>
}
