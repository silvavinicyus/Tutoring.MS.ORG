import { injectable } from 'inversify'
import { ValidationError } from 'class-validator'
import { validationError } from '@business/module/errors/validationErrors'
import { AbstractSerializer } from '../serializers/abstractSerializer'

@injectable()
export abstract class AbstractOperator<I, O> {
  abstract run(input: I, ...args: unknown[]): Promise<O>

  protected exec(input: AbstractSerializer<I>, trim = true): void {
    try {
      if (trim) {
        input.trim()
      }
      input.validate()
    } catch (error) {
      if (
        error instanceof Array &&
        error.length &&
        error[0] instanceof ValidationError
      ) {
        const validationErrors = error as ValidationError[]

        const constraints = this.getErrorConstrainsts(validationErrors)

        const details = validationErrors.map((validationErrorValue) => ({
          property: validationErrorValue.property,
          value: validationErrorValue.value,
          errors: Object.entries(constraints).map(
            ([, errorMessage]) => errorMessage
          ),
        }))

        throw validationError(details)
      }
      throw error
    }
  }

  private getErrorConstrainsts(errors: ValidationError[]): {
    [type: string]: string
  }[] {
    function getNestedConstraint(error: ValidationError): {
      [type: string]: string
    } {
      return error.constraints
        ? error.constraints
        : getNestedConstraint(error.children[0])
    }
    return errors.map((error) => getNestedConstraint(error))
  }
}
