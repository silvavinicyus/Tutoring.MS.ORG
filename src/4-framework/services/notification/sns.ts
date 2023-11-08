import { SNS } from 'aws-sdk'
import { injectable } from 'inversify'
import { IInputCreateUserNotificationDto } from '@business/dto/notification/createUser'
import { INotificationService } from '@business/services/notification/iNotificationService'
import { MS_ORG } from '@shared/microServicesConstants'
import { IInputCreateOrUpdateTutoringNotificationDto } from '@business/dto/notification/createOrUpdateTutoring'
import { IInputCreateOrUpdateStudyGroupNotificationDto } from '@business/dto/notification/createOrUpdateStudyGroup'

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

  async createOrUpdateTutoring(
    input: IInputCreateOrUpdateTutoringNotificationDto
  ): Promise<void> {
    await this.orgSNS
      .publish({
        TopicArn: MS_ORG.sns.createOrUpdateTutoring,
        Message: JSON.stringify(input),
      })
      .promise()
  }

  async createOrUpdateStudyGroup(
    input: IInputCreateOrUpdateStudyGroupNotificationDto
  ): Promise<void> {
    await this.orgSNS
      .publish({
        TopicArn: MS_ORG.sns.createOrUpdateStudyGroup,
        Message: JSON.stringify(input),
      })
      .promise()
  }
}
