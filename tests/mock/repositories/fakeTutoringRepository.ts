import { injectable } from 'inversify'
import { IInputDeleteTutoringDto } from '@business/dto/tutoring/delete'
import { IInputFindAllTutoringsDto } from '@business/dto/tutoring/findAll'
import { IInputFindByTutoringDto } from '@business/dto/tutoring/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import {
  IInputUpdateTutoring,
  ITutoringRepository,
} from '@business/repositories/tutoring/iTutoringRepository'
import { ITutoringEntity } from '@domain/entities/tutoring'

@injectable()
export class FakeTutoringRepository implements ITutoringRepository {
  create(_input: ITutoringEntity): Promise<ITutoringEntity> {
    return void 0
  }
  findBy(_input: IInputFindByTutoringDto): Promise<ITutoringEntity> {
    return void 0
  }
  findAll(
    _input: IInputFindAllTutoringsDto
  ): Promise<IPaginatedResponse<ITutoringEntity>> {
    return void 0
  }
  update(_input: IInputUpdateTutoring): Promise<Partial<ITutoringEntity>> {
    return void 0
  }
  delete(_input: IInputDeleteTutoringDto): Promise<void> {
    return void 0
  }
}

export const fakeTutoringRepositoryUpdate = jest.spyOn(
  FakeTutoringRepository.prototype,
  'update'
)

export const fakeTutoringRepositoryFindAll = jest.spyOn(
  FakeTutoringRepository.prototype,
  'findAll'
)

export const fakeTutoringRepositoryFindBy = jest.spyOn(
  FakeTutoringRepository.prototype,
  'findBy'
)

export const fakeTutoringRepositoryDelete = jest.spyOn(
  FakeTutoringRepository.prototype,
  'delete'
)

export const fakeTutoringRepositoryCreate = jest.spyOn(
  FakeTutoringRepository.prototype,
  'create'
)
