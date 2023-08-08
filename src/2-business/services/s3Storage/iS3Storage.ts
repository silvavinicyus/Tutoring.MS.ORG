export const IS3StorageServiceToken = Symbol.for('IS3StorageServiceToken')

export const IUniqueIdentifierServiceToken = Symbol.for(
  'IS3StorageServiceToken'
)

export interface IStorageS3 {
  filename: string
  folder: string
  fileContent: Buffer
  contentType: string
}

export interface IS3StorageService {
  save({
    filename,
    folder,
    fileContent,
    contentType,
  }: IStorageS3): Promise<string>

  delete(filename: string, folder: string): Promise<void>
}
