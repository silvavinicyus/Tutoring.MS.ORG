import { IInputCreateUserNotificationDto } from '@business/dto/notification/createUser'

export const INotificationServiceToken = Symbol.for('NotificationServiceToken')

export interface INotificationService {
  createUser(input: IInputCreateUserNotificationDto): Promise<void>
}
