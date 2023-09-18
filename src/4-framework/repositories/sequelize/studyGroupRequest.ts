import { injectable } from 'inversify'
import { IInputDeleteStudyGroupRequestDto } from '@business/dto/studyGroupRequest/delete'
import { IInputFindByStudyGroupRequestDto } from '@business/dto/studyGroupRequest/findBy'
import { IStudyGroupRequestRepository } from '@business/repositories/studyGroupRequest/iStudyGroupRequestRepository'
import { IStudyGroupRequestEntity } from '@domain/entities/studyGroupRequest'
import { StudyGroupRequestModel } from '@framework/models/studyGroupRequest'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class StudyGroupRequestRepository
  implements IStudyGroupRequestRepository
{
  async create(
    input: IStudyGroupRequestEntity,
    trx?: ITransaction
  ): Promise<IStudyGroupRequestEntity> {
    const groupRequest = await StudyGroupRequestModel.create(input, {
      transaction: trx,
    })

    return groupRequest.get({
      plain: true,
    })
  }

  async delete(
    input: IInputDeleteStudyGroupRequestDto,
    trx?: ITransaction
  ): Promise<void> {
    await StudyGroupRequestModel.destroy({
      where: {
        uuid: input.uuid,
      },
      transaction: trx,
    })

    return void 0
  }

  async findBy(
    input: IInputFindByStudyGroupRequestDto
  ): Promise<IStudyGroupRequestEntity> {
    const options = createFindAllOptions(input)

    const groupRequest = await StudyGroupRequestModel.findOne(options)

    if (!groupRequest) {
      return void 0
    }

    return groupRequest.get({ plain: true })
  }
}
