import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { Right, right } from '@shared/either'

export interface IFileEntity extends ITimestamps {
  id: number
  uuid: string
  name: string
  key: string
  type: string
}

export type IInputFileEntity = Pick<IFileEntity, 'name' | 'key' | 'type'>

export class FileEntity extends AbstractEntity<IFileEntity> {
  static create(
    props: IInputFileEntity,
    currentDate: Date
  ): Right<void, FileEntity> {
    const file = new FileEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })

    return right(file)
  }
}
