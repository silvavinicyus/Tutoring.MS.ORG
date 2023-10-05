export const IS3StorageServiceToken = Symbol.for('IS3StorageServiceToken')

export interface IFile {
  filename: string
  mimetype: string
  enconding: string
  truncated: boolean
  content: Buffer
}

export const allowedMimes = [
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/jpg',
]

export interface IS3StorageService {
  save(file: IFile, key: string): Promise<void>

  delete(key: string): Promise<void>

  savePrivateFile(file: IFile, key: string): Promise<void>

  deletePrivateFile(key: string): Promise<void>
}
