import { format, transports } from 'winston'

const logFormat = format.printf(
  ({ level, message, timestamp }) =>
    `[${
      timestamp.split('T')[1].split('.')[0]
    }] ${level.toUpperCase()}: ${message}`
)

export const loggerConfig = {
  format: format.combine(format.timestamp(), logFormat),
  transports: [new transports.Console()],
}
