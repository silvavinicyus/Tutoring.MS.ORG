import { ITutoringEntity, TutoringEntityKeys } from '@domain/entities/tutoring'
import { ITransaction } from '@business/dto/transaction/create'
import { IInputFindByTutoringDto } from '@business/dto/tutoring/findBy'
import { IInputFindAllTutoringsDto } from '@business/dto/tutoring/findAll'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IInputUpdateTutoringDto } from '@business/dto/tutoring/update'
import { IInputDeleteTutoringDto } from '@business/dto/tutoring/delete'
import { IWhere } from '../where'

export const ITutoringRepositoryToken = Symbol.for('TutoringRepositorySymbol')

export type updateWhereTutoring = IWhere<
  keyof TutoringEntityKeys,
  string | number
>

export interface IInputUpdateTutoring {
  updateWhere: updateWhereTutoring
  newData: IInputUpdateTutoringDto
}

export interface ITutoringRepository {
  create(input: ITutoringEntity, trx?: ITransaction): Promise<ITutoringEntity>
  findBy(input: IInputFindByTutoringDto): Promise<ITutoringEntity>
  findAll(
    input: IInputFindAllTutoringsDto
  ): Promise<IPaginatedResponse<ITutoringEntity>>
  update(
    input: IInputUpdateTutoring,
    trx?: ITransaction
  ): Promise<Partial<ITutoringEntity>>
  delete(input: IInputDeleteTutoringDto, trx?: ITransaction): Promise<void>
}
