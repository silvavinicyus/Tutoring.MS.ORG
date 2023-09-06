import { IInputDeleteStudyGroupDto } from '@business/dto/studyGroup/delete'
import { IInputFindAllStudyGroupsDto } from '@business/dto/studyGroup/findAll'
import { IInputFindStudyGroupByDto } from '@business/dto/studyGroup/findBy'
import { ITransaction } from '@business/dto/transaction/create'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupEntity } from '@domain/entities/studyGroup'

export const IStudyGroupRepositoryToken = Symbol.for(
  'StudyGroupRepositorySymbol'
)

export interface IStudyGroupRepository {
  create(
    input: IStudyGroupEntity,
    trx?: ITransaction
  ): Promise<IStudyGroupEntity>
  findBy(input: IInputFindStudyGroupByDto): Promise<IStudyGroupEntity>
  findAll(
    input: IInputFindAllStudyGroupsDto
  ): Promise<IPaginatedResponse<IStudyGroupEntity>>
  delete(input: IInputDeleteStudyGroupDto, trx?: ITransaction): Promise<void>
}
