export const ILoggerServiceToken = Symbol.for('ILoggerServiceToken')

export interface ILoggerService {
  error(message?: string, ...meta: string[]): void
  warn(message?: string, ...meta: string[]): void
  info(message?: string, ...meta: string[]): void
}
