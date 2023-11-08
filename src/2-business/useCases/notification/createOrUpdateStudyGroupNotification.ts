import { inject, injectable } from 'inversify'
import {
  IInputCreateOrUpdateStudyGroupNotificationDto,
  IOutputCreateOrUpdateStudyGroupNotificationDto,
} from '@business/dto/notification/createOrUpdateStudyGroup'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  INotificationService,
  INotificationServiceToken,
} from '@business/services/notification/iNotificationService'
import { left, right } from '@shared/either'
import { NotificationErrors } from '@business/module/errors/notificationErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateOrUpdateStudyGroupNotificationUseCase
  implements
    IAbstractUseCase<
      IInputCreateOrUpdateStudyGroupNotificationDto,
      IOutputCreateOrUpdateStudyGroupNotificationDto
    >
{
  constructor(
    @inject(INotificationServiceToken)
    private notificationService: INotificationService,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputCreateOrUpdateStudyGroupNotificationDto
  ): Promise<IOutputCreateOrUpdateStudyGroupNotificationDto> {
    try {
      const notification =
        await this.notificationService.createOrUpdateStudyGroup(props)

      return right(notification)
    } catch (err) {
      this.loggerService.error(err)
      return left(NotificationErrors.createOrUpdateStudyGroupFailed())
    }
  }
}
