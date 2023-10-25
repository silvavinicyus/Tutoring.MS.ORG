import { injectable } from 'inversify'
import {
  IInputAuthorizeUseCase,
  IOutputAuthorizeUseCase,
} from '@business/dto/role/authorize'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class VerifyProfileUseCase
  implements IAbstractUseCase<IInputAuthorizeUseCase, IOutputAuthorizeUseCase>
{
  async exec(input: IInputAuthorizeUseCase): Promise<IOutputAuthorizeUseCase> {
    const allowedPermissions = [...input.permissions, 'admin']

    const userPermissions = input.user.permissions.split(',')

    if (
      !allowedPermissions.some((element) => userPermissions.includes(element))
    ) {
      return left(RolesErrors.notAllowed())
    }

    return right({
      ...input.user,
    })
  }
}
