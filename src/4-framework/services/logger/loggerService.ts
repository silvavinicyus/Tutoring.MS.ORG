import { ILoggerService } from '@business/services/logger/iLogger'
import { createLogger } from 'winston'
import { injectable } from 'inversify'
import { loggerConfig } from '@framework/utility/logger'

@injectable()
export class LoggerService implements ILoggerService {
  private logger = createLogger(loggerConfig)

  debug(message?: string, ...meta: string[]): void {
    this.logger.debug(message || '', ...meta)
  }

  info(message?: string, ...meta: string[]): void {
    this.logger.info(message || '', ...meta)
  }

  warn(message?: string, ...meta: string[]): void {
    this.logger.warn(message || '', ...meta)
  }

  error(message?: string, ...meta: string[]): void {
    this.logger.error(message || '', ...meta)
  }
}
