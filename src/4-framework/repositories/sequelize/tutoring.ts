import { injectable } from 'inversify'
import {
  IInputUpdateTutoring,
  ITutoringRepository,
} from '@business/repositories/tutoring/iTutoringRepository'
import { IInputDeleteTutoringDto } from '@business/dto/tutoring/delete'
import { IInputFindAllTutoringsDto } from '@business/dto/tutoring/findAll'
import { IInputFindByTutoringDto } from '@business/dto/tutoring/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { ITutoringEntity } from '@domain/entities/tutoring'
import { TutoringModel } from '@framework/models/tutoring'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class TutoringRepository implements ITutoringRepository {
  async create(
    input: ITutoringEntity,
    trx?: ITransaction
  ): Promise<ITutoringEntity> {
    const tutoring = await TutoringModel.create(input, {
      transaction: trx,
    })

    return tutoring.get({ plain: true })
  }

  async findBy(input: IInputFindByTutoringDto): Promise<ITutoringEntity> {
    const options = createFindAllOptions(input)

    const tutoring = await TutoringModel.findOne(options)

    if (!tutoring) {
      return void 0
    }

    return tutoring.get({ plain: true })
  }

  async findAll(
    input: IInputFindAllTutoringsDto
  ): Promise<IPaginatedResponse<ITutoringEntity>> {
    const options = createFindAllOptions(input)

    const tutorings = await TutoringModel.findAll(options)

    return {
      items: tutorings.map((tutoring) => tutoring.get({ plain: true })),
      count: tutorings.length,
      page: input.pagination.page || 0,
      perPage: input.pagination.count || 10,
    }
  }

  async update(
    input: IInputUpdateTutoring,
    trx?: ITransaction
  ): Promise<Partial<ITutoringEntity>> {
    await TutoringModel.update(input.newData, {
      where: { [input.updateWhere.column]: input.updateWhere.value },
      transaction: trx,
    })

    return input.newData as ITutoringEntity
  }

  async delete(
    input: IInputDeleteTutoringDto,
    trx?: ITransaction
  ): Promise<void> {
    await TutoringModel.destroy({
      where: {
        id: input.id,
      },
      transaction: trx,
    })

    return void 0
  }
}
