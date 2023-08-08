/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsValidDate(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            Object.prototype.toString.call(value) === '[object Date]' &&
            value instanceof Date &&
            !Number.isNaN(Number(value))
          )
        },
        defaultMessage() {
          return `${propertyName} must be a valid date`
        },
      },
    })
  }
}

export function IsUrlOrString(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false
          }

          return value.trim() === '' || /^(http|https):\/\/[^ "]+$/.test(value)
        },
        defaultMessage() {
          return `${propertyName} must be a valid url or a string`
        },
      },
    })
  }
}
