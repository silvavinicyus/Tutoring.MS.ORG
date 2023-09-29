import { SNS } from 'aws-sdk'
import { injectable } from 'inversify'
import { IInputCreateUserNotificationDto } from '@business/dto/notification/createUser'
import { INotificationService } from '@business/services/notification/iNotificationService'
import { MS_ORG } from '@shared/microServicesConstants'

@injectable()
export class SnsNotificationService implements INotificationService {
  private orgSNS = new SNS({
    region: process.env.SNS_REGION,
    endpoint: MS_ORG.sns.endpoint,
  })

  async createUser(input: IInputCreateUserNotificationDto): Promise<void> {
    await this.orgSNS
      .publish({
        TopicArn: MS_ORG.sns.createUser,
        Message: JSON.stringify(input),
      })
      .promise()
  }
}
