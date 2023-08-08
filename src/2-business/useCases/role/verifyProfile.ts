import {
  IAuthorizerInformationFormated,
  IInputAuthorizeUseCase,
  IOutputAuthorizeUseCase,
} from '@business/dto/role/authorize'
import { RolesErrors } from '@business/module/errors/rolesErrors'
import { left, right } from '@shared/either'
import { injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class VerifyProfileUseCase
  implements IAbstractUseCase<IInputAuthorizeUseCase, IOutputAuthorizeUseCase>
{
  async exec(input: IInputAuthorizeUseCase): Promise<IOutputAuthorizeUseCase> {
    const allowedProfiles = [...input.allowedProfiles, 'admin']
    const { collaborator_id, id } = input.authorizerInformation
    const parsedAuthorizer: IAuthorizerInformationFormated = {
      ...input.authorizerInformation,
      collaborator_id: +collaborator_id,
      id: +id,
    }
    if (!allowedProfiles.includes(parsedAuthorizer.role)) {
      const lastChance = input.lastChance
        ? await input.lastChance(parsedAuthorizer)
        : false
      return lastChance
        ? right(parsedAuthorizer)
        : left(RolesErrors.notAllowed())
    }
    return right(parsedAuthorizer)
  }
}
