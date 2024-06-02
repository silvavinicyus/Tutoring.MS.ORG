import { inject, injectable } from 'inversify'
import {
  IInputDeletePrivateFileDto,
  IOutputDeletePrivateFileDto,
} from '@business/dto/storage/deletePrivateFile'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IS3StorageService,
  IS3StorageServiceToken,
} from '@business/services/s3Storage/iS3Storage'
import { left, right } from '@shared/either'
import { StorageErrors } from '@business/module/errors/storageErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeletePrivateFileUseCase
  implements
    IAbstractUseCase<IInputDeletePrivateFileDto, IOutputDeletePrivateFileDto>
{
  constructor(
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IS3StorageServiceToken)
    private storageService: IS3StorageService
  ) {}

  async exec(
    props: IInputDeletePrivateFileDto
  ): Promise<IOutputDeletePrivateFileDto> {
    try {
      const fileResult = await this.storageService.deletePrivateFile(props.key)

      return right(fileResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(StorageErrors.failedToDeletePrivateFile())
    }
  }
}
