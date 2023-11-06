import { injectable } from 'inversify'
import { Op } from 'sequelize'
import { IInputDeleteStudyGroupStudentDto } from '@business/dto/studyGroupStudent/delete'
import { IInputDeleteManyGroupStudentsDto } from '@business/dto/studyGroupStudent/deleteMany'
import { IInputFindAllStudyGroupStudentsDto } from '@business/dto/studyGroupStudent/findAll'
import { IInputFindByStudyGroupStudentDto } from '@business/dto/studyGroupStudent/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { IStudyGroupStudentRepository } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { IStudyGroupStudentsEntity } from '@domain/entities/studyGroupStudents'
import { IUserEntity } from '@domain/entities/user'
import { StudyGroupStudentsModel } from '@framework/models/studyGroupStudents'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class StudyGroupStudentRepository
  implements IStudyGroupStudentRepository
{
  async deleteMany(
    input: IInputDeleteManyGroupStudentsDto,
    trx?: ITransaction
  ): Promise<void> {
    const deleteUsingStudentIds = !!(
      input.students_ids && input.students_ids.length > 0
    )

    if (deleteUsingStudentIds) {
      await StudyGroupStudentsModel.destroy({
        where: {
          group_id: input.group_id,
          student_id: {
            [Op.in]: input.students_ids,
          },
        },
        transaction: trx,
      })

      return void 0
    }

    await StudyGroupStudentsModel.destroy({
      where: {
        group_id: input.group_id,
      },
      transaction: trx,
    })

    return void 0
  }

  async delete(
    input: IInputDeleteStudyGroupStudentDto,
    trx?: ITransaction
  ): Promise<void> {
    await StudyGroupStudentsModel.destroy({
      where: {
        id: input.id,
      },
      transaction: trx,
    })

    return void 0
  }

  async create(
    input: IStudyGroupStudentsEntity,
    trx?: ITransaction
  ): Promise<IStudyGroupStudentsEntity> {
    const studyGroupStudent = await StudyGroupStudentsModel.create(input, {
      transaction: trx,
    })

    return studyGroupStudent.get({ plain: true })
  }

  async findBy(
    input: IInputFindByStudyGroupStudentDto
  ): Promise<IStudyGroupStudentsEntity> {
    const options = createFindAllOptions(input)

    const studyGroupStudent = await StudyGroupStudentsModel.findOne(options)

    if (!studyGroupStudent) {
      return void 0
    }

    return studyGroupStudent.get({ plain: true })
  }

  async findAll(
    input: IInputFindAllStudyGroupStudentsDto
  ): Promise<IPaginatedResponse<IUserEntity>> {
    const options = createFindAllOptions(input)

    const studyGroupStudent = await StudyGroupStudentsModel.findAll(options)

    if (!studyGroupStudent) {
      return void 0
    }

    return {
      count: studyGroupStudent.length,
      items: studyGroupStudent.map(
        (sgStudent) => sgStudent.get({ plain: true }).student
      ),
      page: input.pagination.page || 0,
      perPage: input.pagination.count || 10,
    }
  }
}
