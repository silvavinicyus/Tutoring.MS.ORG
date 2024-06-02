import { IUserEntity } from '@domain/entities/user'

export const fakeUserEntity: IUserEntity = {
  id: 1,
  uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  created_at: new Date(),
  updated_at: new Date(),
  birthdate: new Date(),
  email: 'email@email.com',
  name: 'name',
  phone: '82 981498282',
}
