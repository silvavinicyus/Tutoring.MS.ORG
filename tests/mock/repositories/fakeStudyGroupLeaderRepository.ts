import { injectable } from 'inversify'
import { IInputDeleteStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/delete'
import { IInputFindAllStudyGroupLeadersDto } from '@business/dto/studyGroupLeader/findAll'
import { IInputFindByStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupLeaderRepository } from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import { IStudyGroupLeaderEntity } from '@domain/entities/studyGroupLeader'
import { IUserEntity } from '@domain/entities/user'

@injectable()
export class FakeStudyGroupLeaderRepository
  implements IStudyGroupLeaderRepository
{
  create(_input: IStudyGroupLeaderEntity): Promise<IStudyGroupLeaderEntity> {
    return void 0
  }
  findBy(
    _input: IInputFindByStudyGroupLeaderDto
  ): Promise<IStudyGroupLeaderEntity> {
    return void 0
  }
  findAll(
    _input: IInputFindAllStudyGroupLeadersDto
  ): Promise<IPaginatedResponse<IUserEntity>> {
    return void 0
  }
  delete(_input: IInputDeleteStudyGroupLeaderDto): Promise<void> {
    return void 0
  }
}

export const fakeStudyGroupLeaderRepositoryFindAll = jest.spyOn(
  FakeStudyGroupLeaderRepository.prototype,
  'findAll'
)

export const fakeStudyGroupLeaderRepositoryFindBy = jest.spyOn(
  FakeStudyGroupLeaderRepository.prototype,
  'findBy'
)

export const fakeStudyGroupLeaderRepositoryDelete = jest.spyOn(
  FakeStudyGroupLeaderRepository.prototype,
  'delete'
)

export const fakeStudyGroupLeaderRepositoryCreate = jest.spyOn(
  FakeStudyGroupLeaderRepository.prototype,
  'create'
)
