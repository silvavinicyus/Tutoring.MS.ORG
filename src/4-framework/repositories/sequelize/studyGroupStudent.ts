import { injectable } from 'inversify'
import { IStudyGroupStudentsEntity } from '@domain/entities/studyGroupStudents'
import { StudyGroupStudentsModel } from '@framework/models/studyGroupStudents'
import { IStudyGroupStudentRepository } from '@business/repositories/studyGroupStudent/iStudyGroupStudentRepository'
import { IInputDeleteStudyGroupStudentDto } from '@business/dto/studyGroupStudent/delete'
import { IInputFindAllStudyGroupStudentsDto } from '@business/dto/studyGroupStudent/findAll'
import { IInputFindByStudyGroupStudentDto } from '@business/dto/studyGroupStudent/findBy'
import { IPaginatedResponse } from '@business/dto/useCaseOptions'
import { createFindAllOptions } from '@framework/utility/repositoryUtils'
import { ITransaction } from './transaction'

@injectable()
export class StudyGroupStudentRepository
  implements IStudyGroupStudentRepository
{
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
  ): Promise<IPaginatedResponse<IStudyGroupStudentsEntity>> {
    const options = createFindAllOptions(input)

    const studyGroupStudent = await StudyGroupStudentsModel.findAll(options)

    if (!studyGroupStudent) {
      return void 0
    }

    return {
      count: studyGroupStudent.length,
      items: studyGroupStudent.map((sgStudent) =>
        sgStudent.get({ plain: true })
      ),
      page: input.pagination.page || 0,
      perPage: input.pagination.count || 10,
    }
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
}
