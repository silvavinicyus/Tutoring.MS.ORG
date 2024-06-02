import { injectable } from 'inversify'
import { IStudyGroupRequestRepository } from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import { IInputDeleteStudyGroupRequestDto } from '@business/dto/studyGroupRequest/delete'
import { IInputFindByStudyGroupRequestDto } from '@business/dto/studyGroupRequest/findBy'
import { IStudyGroupRequestEntity } from '@domain/entities/studyGroupRequest'

@injectable()
export class FakeStudyGroupRequestRepository
  implements IStudyGroupRequestRepository
{
  create(_input: IStudyGroupRequestEntity): Promise<IStudyGroupRequestEntity> {
    return void 0
  }
  delete(_input: IInputDeleteStudyGroupRequestDto): Promise<void> {
    return void 0
  }
  findBy(
    _input: IInputFindByStudyGroupRequestDto
  ): Promise<IStudyGroupRequestEntity> {
    return void 0
  }
}

export const fakeStudyGroupRequestRepositoryFindBy = jest.spyOn(
  FakeStudyGroupRequestRepository.prototype,
  'findBy'
)

export const fakeStudyGroupRequestRepositoryDelete = jest.spyOn(
  FakeStudyGroupRequestRepository.prototype,
  'delete'
)

export const fakeStudyGroupRequestRepositoryCreate = jest.spyOn(
  FakeStudyGroupRequestRepository.prototype,
  'create'
)
