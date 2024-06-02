import { IStudyGroupEntity } from '@domain/entities/studyGroup'

export const fakeStudyGroupEntity: IStudyGroupEntity = {
  id: 1,
  uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  created_at: new Date(),
  updated_at: new Date(),
  creator_id: 1,
  name: 'name',
  subject: 'subject',
}
