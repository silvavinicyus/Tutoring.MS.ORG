import { inject, injectable } from 'inversify'
import {
  IInputCreateOrUpdateTutoringNotificationDto,
  IOutputCreateOrUpdateTutoringNotificationDto,
} from '@business/dto/notification/createOrUpdateTutoring'
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
export class CreateOrUpdateTutoringNotificatoinUseCase
  implements
    IAbstractUseCase<
      IInputCreateOrUpdateTutoringNotificationDto,
      IOutputCreateOrUpdateTutoringNotificationDto
    >
{
  constructor(
    @inject(INotificationServiceToken)
    private notificationService: INotificationService,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputCreateOrUpdateTutoringNotificationDto
  ): Promise<IOutputCreateOrUpdateTutoringNotificationDto> {
    try {
      const notification =
        await this.notificationService.createOrUpdateTutoring(props)

      return right(notification)
    } catch (err) {
      this.loggerService.error(err)
      return left(NotificationErrors.createOrUpdateTutoringFailed())
    }
  }
}
