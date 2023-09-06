import { injectable } from 'inversify'
import { IStudyGroupRepository } from '@business/repositories/studyGroup/iStudyGroupRepository'
import { IInputDeleteStudyGroupDto } from '@business/dto/studyGroup/delete'
import { IInputFindAllStudyGroupsDto } from '@business/dto/studyGroup/findAll'
import { IInputFindStudyGroupByDto } from '@business/dto/studyGroup/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupEntity } from '@domain/entities/studyGroup'
import { StudyGroupModel } from '@framework/models/studyGroup'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class StudyGroupRepository implements IStudyGroupRepository {
  async create(
    input: IStudyGroupEntity,
    trx?: ITransaction
  ): Promise<IStudyGroupEntity> {
    const studyGroupResult = await StudyGroupModel.create(input, {
      transaction: trx,
    })

    return studyGroupResult.get({ plain: true })
  }

  async findBy(input: IInputFindStudyGroupByDto): Promise<IStudyGroupEntity> {
    const options = createFindAllOptions(input)

    const studyGroup = await StudyGroupModel.findOne(options)

    if (!studyGroup) {
      return void 0
    }

    return studyGroup.get({ plain: true })
  }

  async findAll(
    input: IInputFindAllStudyGroupsDto
  ): Promise<IPaginatedResponse<IStudyGroupEntity>> {
    const options = createFindAllOptions(input)

    const studyGroups = await StudyGroupModel.findAll(options)

    return {
      items: studyGroups.map((user) => user.get({ plain: true })),
      count: studyGroups.length,
      page: input.pagination.page || 0,
      perPage: input.pagination.count || 10,
    }
  }

  async delete(
    input: IInputDeleteStudyGroupDto,
    trx?: ITransaction
  ): Promise<void> {
    await StudyGroupModel.destroy({
      where: {
        id: input.id,
      },
      transaction: trx,
    })

    return void 0
  }
}
