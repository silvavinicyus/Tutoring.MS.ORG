import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { right, Right } from '@shared/either'

export interface IUserEntity extends ITimestamps {
  id: number
  uuid: string
  name: string
  email: string
  birthdate: Date
  phone: string
}

export type IInputUserEntity = Pick<
  IUserEntity,
  'name' | 'email' | 'birthdate' | 'phone'
>

export type UserEntityKeys = Pick<IUserEntity, 'name' | 'email' | 'uuid' | 'id'>

export class UserEntity extends AbstractEntity<IUserEntity> {
  static create(
    props: IInputUserEntity,
    currentDate: Date
  ): Right<void, UserEntity> {
    const userEntity = new UserEntity({
      id: undefined,
      uuid: undefined,
      created_at: currentDate,
      updated_at: currentDate,
      ...props,
    })
    return right(userEntity)
  }

  static update(
    props: Partial<IUserEntity>,
    currentDate: Date
  ): Right<void, UserEntity> {
    const userEntity = new UserEntity({
      ...props,
      updated_at: currentDate,
    } as IUserEntity)
    return right(userEntity)
  }
}
