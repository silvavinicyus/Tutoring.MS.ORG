import { ITutoringEntity } from '@domain/entities/tutoring'

export const fakeTutoringEntity: ITutoringEntity = {
  id: 1,
  uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  created_at: new Date(),
  updated_at: new Date(),
  date: new Date(),
  student_id: 1,
  tutor_id: 1,
  subject: 'subject',
}
