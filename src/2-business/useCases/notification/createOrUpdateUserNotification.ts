import { inject, injectable } from 'inversify'
import {
  IInputCreateOrUpdateUserNotificationDto,
  IOutputCreateOrUpdateUserNotificationDto,
} from '@business/dto/notification/createOrUpdateUser'
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
export class CreateOrUpdateUserNotification
  implements
    IAbstractUseCase<
      IInputCreateOrUpdateUserNotificationDto,
      IOutputCreateOrUpdateUserNotificationDto
    >
{
  constructor(
    @inject(INotificationServiceToken)
    private notificationService: INotificationService,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputCreateOrUpdateUserNotificationDto
  ): Promise<IOutputCreateOrUpdateUserNotificationDto> {
    try {
      const notification = await this.notificationService.createOrUpdateUser(
        props
      )

      return right(notification)
    } catch (err) {
      this.loggerService.error(err)
      return left(NotificationErrors.createOrUpdateUserFailed())
    }
  }
}
