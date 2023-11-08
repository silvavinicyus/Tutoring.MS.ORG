import { ITutoringEntity } from '@domain/entities/tutoring'
import { IError } from '@shared/IError'
import { Either } from '@shared/either'

export type IInputCreateOrUpdateTutoringNotificationDto = Pick<
  ITutoringEntity,
  'date' | 'subject'
> & {
  tutor_real_id: number
  student_real_id: number
  tutoring_real_id: number
  tutoring_real_uuid: string
}

export type IOutputCreateOrUpdateTutoringNotificationDto = Either<IError, void>
