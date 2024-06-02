import { IFileEntity } from '@domain/entities/file'

export const fakeFileEntity: IFileEntity = {
  id: 1,
  uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  created_at: new Date(),
  updated_at: new Date(),
  key: 'file_key',
  name: 'new name',
  type: 'type',
}
