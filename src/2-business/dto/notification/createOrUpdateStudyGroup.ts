import { IStudyGroupEntity } from '@domain/entities/studyGroup'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateOrUpdateStudyGroupNotificationDto = {
  studyGroup?: Pick<IStudyGroupEntity, 'name' | 'subject'> & {
    creator_real_id: number
    study_group_real_id: number
    study_group_real_uuid: string
  }
  deleted?: boolean
}

export type IOutputCreateOrUpdateStudyGroupNotificationDto = Either<
  IError,
  void
>
