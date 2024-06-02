import { IInputCreateOrUpdateUserNotificationDto } from '@business/dto/notification/createOrUpdateUser'
import { IInputCreateOrUpdateStudyGroupNotificationDto } from '@business/dto/notification/createOrUpdateStudyGroup'
import { IInputCreateOrUpdateTutoringNotificationDto } from '@business/dto/notification/createOrUpdateTutoring'

export const INotificationServiceToken = Symbol.for('NotificationServiceToken')

export interface INotificationService {
  createOrUpdateUser(
    input: IInputCreateOrUpdateUserNotificationDto
  ): Promise<void>
  createOrUpdateTutoring(
    input: IInputCreateOrUpdateTutoringNotificationDto
  ): Promise<void>
  createOrUpdateStudyGroup(
    input: IInputCreateOrUpdateStudyGroupNotificationDto
  ): Promise<void>
}
