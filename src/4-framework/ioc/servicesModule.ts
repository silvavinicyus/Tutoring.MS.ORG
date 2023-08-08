import {
  IDateService,
  IDateServiceToken
} from '@business/services/date/iDateService'
import { ILoggerServiceToken } from '@business/services/logger/iLogger'
import {
  IS3StorageService,
  IS3StorageServiceToken
} from '@business/services/s3Storage/iS3Storage'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { DateService } from '@framework/services/date/dateService'
import { LoggerService } from '@framework/services/logger/loggerService'
import { S3StorageService } from '@framework/services/s3Storage/S3StorageService'
import { UniqueIdentifierService } from '@framework/services/uniqueIdentifier/uniqueIdentifierService'
import { ContainerModule, interfaces } from 'inversify'

export const servicesModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IUniqueIdentifierService>(IUniqueIdentifierServiceToken).to(
    UniqueIdentifierService
  )
  bind(ILoggerServiceToken).to(LoggerService)

  bind<IS3StorageService>(IS3StorageServiceToken).to(S3StorageService)
  bind<IDateService>(IDateServiceToken).to(DateService)
})
