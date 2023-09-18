import { IInputDeleteStudyGroupRequestDto } from '@business/dto/studyGroupRequest/delete'
import { IInputFindByStudyGroupRequestDto } from '@business/dto/studyGroupRequest/findBy'
import { ITransaction } from '@business/dto/transaction/create'
import { IStudyGroupRequestEntity } from '@domain/entities/studyGroupRequest'

export const IStudyGroupRequestRepositoryToken = Symbol.for(
  'StudyGroupRequestRepositorySymbol'
)

export interface IStudyGroupRequestRepository {
  create(
    input: IStudyGroupRequestEntity,
    trx?: ITransaction
  ): Promise<IStudyGroupRequestEntity>
  delete(
    input: IInputDeleteStudyGroupRequestDto,
    trx?: ITransaction
  ): Promise<void>
  findBy(
    input: IInputFindByStudyGroupRequestDto
  ): Promise<IStudyGroupRequestEntity>
}
