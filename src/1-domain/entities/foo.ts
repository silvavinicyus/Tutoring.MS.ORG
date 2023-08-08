import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { right, Right } from '@shared/either'

export interface IFooEntity extends ITimestamps {
  id: number
  uuid: string
  title: string
}

export type IInputFooEntity = Pick<
  IFooEntity,
  | 'title'
>

export class FooEntity extends AbstractEntity<IFooEntity> {
  static create(
    props: IInputFooEntity,
    currentDate: Date
  ): Right<void, FooEntity> {
    const fooEntity = new FooEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })
    return right(fooEntity)
  }

  static update(
    props: Partial<IFooEntity>,
    currentDate: Date
  ): Right<void, FooEntity> {
    const fooEntity = new FooEntity({
      ...props,
      updated_at: currentDate,
    } as IFooEntity)
    return right(fooEntity)
  }
}
