import { injectable } from 'inversify'
import { IPostReactionRepository } from '@business/repositories/postReaction/iPostReactionRepository'
import { IInputDeletePostReactionDto } from '@business/dto/postReactions/delete'
import { IInputFindAllPostReactionsDto } from '@business/dto/postReactions/findAll'
import { IInputFindByPostReactionDto } from '@business/dto/postReactions/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IPostReactionEntity } from '@domain/entities/postReactions'

@injectable()
export class FakePostReactionRepository implements IPostReactionRepository {
  create(_input: IPostReactionEntity): Promise<IPostReactionEntity> {
    return void 0
  }
  findBy(_input: IInputFindByPostReactionDto): Promise<IPostReactionEntity> {
    return void 0
  }
  findAll(
    _input: IInputFindAllPostReactionsDto
  ): Promise<IPaginatedResponse<IPostReactionEntity>> {
    return void 0
  }
  delete(_input: IInputDeletePostReactionDto): Promise<void> {
    return void 0
  }
}

export const fakePostReactionRepositoryFindBy = jest.spyOn(
  FakePostReactionRepository.prototype,
  'findBy'
)

export const fakePostReactionRepositoryDelete = jest.spyOn(
  FakePostReactionRepository.prototype,
  'delete'
)

export const fakePostReactionRepositoryCreate = jest.spyOn(
  FakePostReactionRepository.prototype,
  'create'
)

export const fakePostReactionRepositoryFindAll = jest.spyOn(
  FakePostReactionRepository.prototype,
  'findAll'
)
