import { injectable } from 'inversify'
import { IStudyGroupLeaderRepository } from '@business/repositories/studyGroupLeader/iStudyGroupLeaderRepository'
import { IInputDeleteStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/delete'
import { IInputFindAllStudyGroupLeadersDto } from '@business/dto/studyGroupLeader/findAll'
import { IInputFindByStudyGroupLeaderDto } from '@business/dto/studyGroupLeader/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupLeaderEntity } from '@domain/entities/studyGroupLeader'
import { StudyGroupLeaderModel } from '@framework/models/studyGroupLeader'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class StudyGroupLeaderRepository implements IStudyGroupLeaderRepository {
  async create(
    input: IStudyGroupLeaderEntity,
    trx?: ITransaction
  ): Promise<IStudyGroupLeaderEntity> {
    const studyGroupLeader = await StudyGroupLeaderModel.create(input, {
      transaction: trx,
    })

    return studyGroupLeader.get({ plain: true })
  }

  async findBy(
    input: IInputFindByStudyGroupLeaderDto
  ): Promise<IStudyGroupLeaderEntity> {
    const options = createFindAllOptions(input)

    const studyGroupLeader = await StudyGroupLeaderModel.findOne(options)

    if (!studyGroupLeader) {
      return void 0
    }

    return studyGroupLeader.get({ plain: true })
  }

  async findAll(
    input: IInputFindAllStudyGroupLeadersDto
  ): Promise<IPaginatedResponse<IStudyGroupLeaderEntity>> {
    const options = createFindAllOptions(input)

    const studyGroupLeader = await StudyGroupLeaderModel.findAll(options)

    if (!studyGroupLeader) {
      return void 0
    }

    return {
      count: studyGroupLeader.length,
      items: studyGroupLeader.map((sgleader) => sgleader.get({ plain: true })),
      page: input.pagination.page || 0,
      perPage: input.pagination.count || 10,
    }
  }

  async delete(
    input: IInputDeleteStudyGroupLeaderDto,
    trx?: ITransaction
  ): Promise<void> {
    await StudyGroupLeaderModel.destroy({
      where: {
        id: input.id,
      },
      transaction: trx,
    })

    return void 0
  }
}
