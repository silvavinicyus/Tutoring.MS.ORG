import { IInputCreateOrUpdateStudyGroupNotificationDto } from '@business/dto/notification/createOrUpdateStudyGroup'
import { IInputCreateOrUpdateTutoringNotificationDto } from '@business/dto/notification/createOrUpdateTutoring'
import { IInputCreateUserNotificationDto } from '@business/dto/notification/createUser'
import { NotificationErrors } from '@business/module/errors/notificationErrors'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import { INotificationServiceToken } from '@business/services/notification/iNotificationService'
import { CreateOrUpdateStudyGroupNotificationUseCase } from '@business/useCases/notification/createOrUpdateStudyGroupNotification'
import { CreateOrUpdateTutoringNotificatoinUseCase } from '@business/useCases/notification/createOrUpdateTutoringNotification'
import { CreateUserNotification } from '@business/useCases/notification/createUserNotification'
import { container } from '@shared/ioc/container'
import { FakeLoggerService } from '@tests/mock/services/fakeLoggerService'
import {
  FakeNotificationService,
  fakeNotificationServiceCreateOrUpdateStudyGroup,
  fakeNotificationServiceCreateOrUpdateTutoring,
  fakeNotificationServiceCreateUser,
} from '@tests/mock/services/fakeNotificationService'

describe('Notifications Use Case', () => {
  beforeAll(() => {
    container.bind(ILoggerServiceToken).to(FakeLoggerService)
    container.bind(INotificationServiceToken).to(FakeNotificationService)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('create or update study group notification use case', () => {
    const input: IInputCreateOrUpdateStudyGroupNotificationDto = {
      creator_real_id: 1,
      name: 'name',
      study_group_real_id: 1,
      study_group_real_uuid: 'real_uuid',
      subject: 'subject',
    }

    test('Should fail to create or update a study group if notification service failed', async () => {
      fakeNotificationServiceCreateOrUpdateStudyGroup.mockImplementationOnce(
        async () => {
          throw new Error()
        }
      )

      const sut = container.get(CreateOrUpdateStudyGroupNotificationUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(
        NotificationErrors.createOrUpdateStudyGroupFailed()
      )
    })

    test('Should have success to create or update a study group', async () => {
      fakeNotificationServiceCreateOrUpdateStudyGroup.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(CreateOrUpdateStudyGroupNotificationUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Create or update tutoring notification use case', () => {
    const input: IInputCreateOrUpdateTutoringNotificationDto = {
      date: new Date(),
      student_real_id: 1,
      subject: 'subject',
      tutor_real_id: 1,
      tutoring_real_id: 1,
      tutoring_real_uuid: 'real_uuid',
    }

    test('Should fail to send a create or update tutoring notification if service failed', async () => {
      fakeNotificationServiceCreateOrUpdateTutoring.mockImplementationOnce(
        async () => {
          throw new Error()
        }
      )

      const sut = container.get(CreateOrUpdateTutoringNotificatoinUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(
        NotificationErrors.createOrUpdateTutoringFailed()
      )
    })

    test('Should have success to send a create or update tutoring notification', async () => {
      fakeNotificationServiceCreateOrUpdateTutoring.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(CreateOrUpdateTutoringNotificatoinUseCase)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('Create user notification use case', () => {
    const input: IInputCreateUserNotificationDto = {
      birthdate: new Date(),
      email: 'email',
      name: 'new name',
      id: 1,
      password: 'password',
      phone: '82 981',
      uuid: 'real_uuid',
    }

    test('Should fail to send a create user notification if service failed', async () => {
      fakeNotificationServiceCreateUser.mockImplementationOnce(async () => {
        throw new Error()
      })

      const sut = container.get(CreateUserNotification)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeTruthy()
      expect(result.isRight()).toBeFalsy()
      expect(result.value).toEqual(NotificationErrors.createUserFailed())
    })

    test('Should have success to send a create user notification', async () => {
      fakeNotificationServiceCreateUser.mockImplementationOnce(
        async () => void 0
      )

      const sut = container.get(CreateUserNotification)
      const result = await sut.exec(input)

      expect(result.isLeft()).toBeFalsy()
      expect(result.isRight()).toBeTruthy()
    })
  })
})
