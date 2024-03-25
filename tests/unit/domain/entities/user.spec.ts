import { UserEntity } from '@domain/entities/user'
import { fakeUserEntity } from '@tests/mock/entities/fakeUserEntity'

describe('User Entity', () => {
  describe('Create Method', () => {
    test('Should be able to create a new user entity', () => {
      const userEntity = UserEntity.create(fakeUserEntity, new Date())

      expect(userEntity.isLeft()).toBeFalsy()
      expect(userEntity.isRight()).toBeTruthy()
    })
  })

  describe('Update Method', () => {
    test('Should be able to update a user entity', () => {
      const userUpdateData = {
        ...fakeUserEntity,
        name: 'new name',
        email: 'new email',
      }

      const userEntityUpdated = UserEntity.update(userUpdateData, new Date())

      expect(userEntityUpdated.isLeft()).toBeFalsy()
      expect(userEntityUpdated.isRight()).toBeTruthy()
      expect(userEntityUpdated.value.export().updated_at).not.toEqual(
        fakeUserEntity.updated_at
      )
    })
  })
})
