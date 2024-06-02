import { IPostEntity } from '@domain/entities/post'

export const fakePostEntity: IPostEntity = {
  id: 1,
  uuid: '194ef2da-8f97-450b-80ee-0ef3758f032b',
  created_at: new Date(),
  updated_at: new Date(),
  content: 'new content',
  fixed: true,
  group_id: 1,
  owner_id: 1,
  title: 'title',
  image_id: null,
}
