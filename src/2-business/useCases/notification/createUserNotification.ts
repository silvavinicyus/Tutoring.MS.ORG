import { inject, injectable } from 'inversify'
import {
  IInputCreateUserNotificationDto,
  IOutputCreateUserNotificationDto,
} from '@business/dto/notification/createUser'
import {
  INotificationService,
  INotificationServiceToken,
} from '@business/services/notification/iNotificationService'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { left, right } from '@shared/either'
import { NotificationErrors } from '@business/module/errors/notificationErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateUserNotification
  implements
    IAbstractUseCase<
      IInputCreateUserNotificationDto,
      IOutputCreateUserNotificationDto
    >
{
  constructor(
    @inject(INotificationServiceToken)
    private notificationService: INotificationService,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputCreateUserNotificationDto
  ): Promise<IOutputCreateUserNotificationDto> {
    try {
      const notification = await this.notificationService.createUser(props)

      return right(notification)
    } catch (err) {
      this.loggerService.error(err)
      return left(NotificationErrors.createUserFailed())
    }
  }
}
