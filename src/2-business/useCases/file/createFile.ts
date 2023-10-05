import { inject, injectable } from 'inversify'
import {
  IInputCreateFileDto,
  IOutputCreateFileDto,
} from '@business/dto/file/create'
import { FileEntity, IInputFileEntity } from '@domain/entities/file'
import {
  IFileRepository,
  IFileRepositoryToken,
} from '@business/repositories/file/iFileRepository'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import { ITransaction } from '@business/dto/transaction/create'
import { left, right } from '@shared/either'
import { FileErrors } from '@business/module/errors/file'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken,
} from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateFileUseCase
  implements IAbstractUseCase<IInputCreateFileDto, IOutputCreateFileDto>
{
  constructor(
    @inject(IFileRepositoryToken)
    private fileRepository: IFileRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService,
    @inject(IUniqueIdentifierServiceToken)
    private uniqueIdentifier: IUniqueIdentifierService
  ) {}

  async exec(
    props: IInputFileEntity,
    trx?: ITransaction
  ): Promise<IOutputCreateFileDto> {
    try {
      const fileEntity = FileEntity.create(props, new Date())

      const file = await this.fileRepository.create(
        {
          ...fileEntity.value.export(),
          uuid: this.uniqueIdentifier.create(),
        },
        trx
      )

      return right(file)
    } catch (err) {
      this.loggerService.error(err)
      return left(FileErrors.creationError())
    }
  }
}
