import { inject, injectable } from 'inversify'
import {
  IInputFindByFileDto,
  IOutputFindByFileDto,
} from '@business/dto/file/findBy'
import {
  ILoggerService,
  ILoggerServiceToken,
} from '@business/services/logger/iLogger'
import {
  IFileRepository,
  IFileRepositoryToken,
} from '@business/repositories/file/iFileRepository'
import { left, right } from '@shared/either'
import { FileErrors } from '@business/module/errors/file'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindByFileUseCase
  implements IAbstractUseCase<IInputFindByFileDto, IOutputFindByFileDto>
{
  constructor(
    @inject(IFileRepositoryToken)
    private fileRepository: IFileRepository,
    @inject(ILoggerServiceToken)
    private loggerService: ILoggerService
  ) {}

  async exec(props: IInputFindByFileDto): Promise<IOutputFindByFileDto> {
    try {
      const file = await this.fileRepository.findBy(props)

      if (!file) {
        return left(FileErrors.notFound())
      }

      return right(file)
    } catch (err) {
      this.loggerService.error(err)
      return left(FileErrors.loadFailed())
    }
  }
}
