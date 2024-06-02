import { injectable } from 'inversify'
import { INotificationService } from '@business/services/notification/iNotificationService'
import { IInputCreateOrUpdateStudyGroupNotificationDto } from '@business/dto/notification/createOrUpdateStudyGroup'
import { IInputCreateOrUpdateTutoringNotificationDto } from '@business/dto/notification/createOrUpdateTutoring'
import { IInputCreateOrUpdateUserNotificationDto } from '@business/dto/notification/createOrUpdateUser'

@injectable()
export class FakeNotificationService implements INotificationService {
  createOrUpdateUser(
    _input: IInputCreateOrUpdateUserNotificationDto
  ): Promise<void> {
    return void 0
  }
  createOrUpdateTutoring(
    _input: IInputCreateOrUpdateTutoringNotificationDto
  ): Promise<void> {
    return void 0
  }
  createOrUpdateStudyGroup(
    _input: IInputCreateOrUpdateStudyGroupNotificationDto
  ): Promise<void> {
    return void 0
  }
}

export const fakeNotificationServiceCreateOrUpdateStudyGroup = jest.spyOn(
  FakeNotificationService.prototype,
  'createOrUpdateStudyGroup'
)

export const fakeNotificationServiceCreateUser = jest.spyOn(
  FakeNotificationService.prototype,
  'createOrUpdateUser'
)

export const fakeNotificationServiceCreateOrUpdateTutoring = jest.spyOn(
  FakeNotificationService.prototype,
  'createOrUpdateTutoring'
)
