import { injectable } from 'inversify'
import { INotificationService } from '@business/services/notification/iNotificationService'
import { IInputCreateOrUpdateStudyGroupNotificationDto } from '@business/dto/notification/createOrUpdateStudyGroup'
import { IInputCreateOrUpdateTutoringNotificationDto } from '@business/dto/notification/createOrUpdateTutoring'
import { IInputCreateUserNotificationDto } from '@business/dto/notification/createUser'

@injectable()
export class FakeNotificationService implements INotificationService {
  createUser(_input: IInputCreateUserNotificationDto): Promise<void> {
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
  'createUser'
)

export const fakeNotificationServiceCreateOrUpdateTutoring = jest.spyOn(
  FakeNotificationService.prototype,
  'createOrUpdateTutoring'
)
