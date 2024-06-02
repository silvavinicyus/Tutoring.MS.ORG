import { inject, injectable } from 'inversify'
import {
  IInputSavePrivateFileDto,
  IOutputSavePrivateFileDto,
} from '@business/dto/storage/savePrivateFile'
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
export class SavePrivateFileUseCase
  implements
    IAbstractUseCase<IInputSavePrivateFileDto, IOutputSavePrivateFileDto>
{
  constructor(
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IS3StorageServiceToken)
    private storageService: IS3StorageService
  ) {}

  async exec(
    props: IInputSavePrivateFileDto
  ): Promise<IOutputSavePrivateFileDto> {
    try {
      const file = await this.storageService.savePrivateFile(
        props.file,
        props.key
      )

      return right(file)
    } catch (err) {
      this.loggerService.error(err)
      return left(StorageErrors.failedToSavePrivateFile())
    }
  }
}
