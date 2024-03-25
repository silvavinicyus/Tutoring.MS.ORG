import { injectable } from 'inversify'
import { IStudyGroupRepository } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IInputDeleteStudyGroupDto } from '@business/dto/studyGroup/delete'
import { IInputFindAllStudyGroupsDto } from '@business/dto/studyGroup/findAll'
import { IInputFindStudyGroupByDto } from '@business/dto/studyGroup/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupEntity } from '@domain/entities/studyGroup'

@injectable()
export class FakeStudyGroupRepository implements IStudyGroupRepository {
  create(_input: IStudyGroupEntity): Promise<IStudyGroupEntity> {
    return void 0
  }
  findBy(_input: IInputFindStudyGroupByDto): Promise<IStudyGroupEntity> {
    return void 0
  }
  findAll(
    _input: IInputFindAllStudyGroupsDto
  ): Promise<IPaginatedResponse<IStudyGroupEntity>> {
    return void 0
  }
  delete(_input: IInputDeleteStudyGroupDto): Promise<void> {
    return void 0
  }
}

export const fakeStudyGroupRepositoryFindAll = jest.spyOn(
  FakeStudyGroupRepository.prototype,
  'findAll'
)

export const fakeStudyGroupRepositoryFindBy = jest.spyOn(
  FakeStudyGroupRepository.prototype,
  'findBy'
)

export const fakeStudyGroupRepositoryDelete = jest.spyOn(
  FakeStudyGroupRepository.prototype,
  'delete'
)

export const fakeStudyGroupRepositoryCreate = jest.spyOn(
  FakeStudyGroupRepository.prototype,
  'create'
)
