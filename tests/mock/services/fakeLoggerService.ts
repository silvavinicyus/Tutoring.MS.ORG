import { injectable } from 'inversify'
import { ILoggerService } from '@business/services/logger/iLogger'

@injectable()
export class FakeLoggerService implements ILoggerService {
  info(_message: string, _meta: string): void {
    return void 0
  }

  warn(_message: string, _meta: string): void {
    return void 0
  }

  error(_message: string, _meta: string): void {
    return void 0
  }
}

export const fakeLoggerServiceInfo = jest.spyOn(
  FakeLoggerService.prototype,
  'info'
)

export const fakeLoggerServiceWarn = jest.spyOn(
  FakeLoggerService.prototype,
  'warn'
)

export const fakeLoggerServiceError = jest.spyOn(
  FakeLoggerService.prototype,
  'error'
)
