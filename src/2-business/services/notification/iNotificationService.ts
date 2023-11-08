import { IInputCreateOrUpdateStudyGroupNotificationDto } from '@business/dto/notification/createOrUpdateStudyGroup'
import { IInputCreateOrUpdateTutoringNotificationDto } from '@business/dto/notification/createOrUpdateTutoring'
import { IInputCreateUserNotificationDto } from '@business/dto/notification/createUser'

export const INotificationServiceToken = Symbol.for('NotificationServiceToken')

export interface INotificationService {
  createUser(input: IInputCreateUserNotificationDto): Promise<void>
  createOrUpdateTutoring(
    input: IInputCreateOrUpdateTutoringNotificationDto
  ): Promise<void>
  createOrUpdateStudyGroup(
    input: IInputCreateOrUpdateStudyGroupNotificationDto
  ): Promise<void>
}
