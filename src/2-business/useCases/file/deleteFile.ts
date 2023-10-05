import { inject, injectable } from 'inversify'
import {
  IInputDeleteFileDto,
  IOutputDeleteFileDto,
} from '@business/dto/file/delete'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IFileRepository,
  IFileRepositoryToken,
} from '@business/repositories/file/iFileRepository'
import { ITransaction } from '@business/dto/transaction/create'
import { left, right } from '@shared/either'
import { FileErrors } from '@business/module/errors/file'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteFileUseCase
  implements IAbstractUseCase<IInputDeleteFileDto, IOutputDeleteFileDto>
{
  constructor(
    @inject(IFileRepositoryToken)
    private fileRepository: IFileRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(
    props: IInputDeleteFileDto,
    trx?: ITransaction
  ): Promise<IOutputDeleteFileDto> {
    try {
      const fileResult = await this.fileRepository.delete(props, trx)

      return right(fileResult)
    } catch (err) {
      this.loggerService.error(err)
      return left(FileErrors.deleteFailed())
    }
  }
}
