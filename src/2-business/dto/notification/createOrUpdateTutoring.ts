import { ITutoringEntity } from '@domain/entities/tutoring'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateOrUpdateTutoringNotificationDto = {
  tutoring?: Pick<ITutoringEntity, 'date' | 'subject'> & {
    tutor_real_id: number
    student_real_id: number
    tutoring_real_id: number
    tutoring_real_uuid: string
  }
  deleted?: boolean
}

export type IOutputCreateOrUpdateTutoringNotificationDto = Either<IError, void>
