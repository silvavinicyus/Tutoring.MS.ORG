import { injectable } from 'inversify'
import { IInputDeletePostDto } from '@business/dto/post/delete'
import { IInputFindAllPostsDto } from '@business/dto/post/findAll'
import { IInputFindByPostDto } from '@business/dto/post/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import {
  IInputUpdatePost,
  IPostRepository,
} from '@business/repositories/post/iPostRepository'
import { IPostEntity } from '@domain/entities/post'

@injectable()
export class FakePostRepository implements IPostRepository {
  async create(_input: IPostEntity): Promise<IPostEntity> {
    return void 0
  }

  async findBy(_input: IInputFindByPostDto): Promise<IPostEntity> {
    return void 0
  }

  async findAll(
    _input: IInputFindAllPostsDto
  ): Promise<IPaginatedResponse<IPostEntity>> {
    return void 0
  }

  async update(_input: IInputUpdatePost): Promise<Partial<IPostEntity>> {
    return void 0
  }

  async delete(_input: IInputDeletePostDto): Promise<void> {
    return void 0
  }
}

export const fakePostRepositoryFindAll = jest.spyOn(
  FakePostRepository.prototype,
  'findAll'
)

export const fakePostRepositoryFindBy = jest.spyOn(
  FakePostRepository.prototype,
  'findBy'
)

export const fakePostRepositoryDelete = jest.spyOn(
  FakePostRepository.prototype,
  'delete'
)

export const fakePostRepositoryCreate = jest.spyOn(
  FakePostRepository.prototype,
  'create'
)

export const fakePostRepositoryUpdate = jest.spyOn(
  FakePostRepository.prototype,
  'update'
)
