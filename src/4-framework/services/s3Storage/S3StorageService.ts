import { S3 } from 'aws-sdk'
import { injectable } from 'inversify'
import {
  IFile,
  IS3StorageService,
} from '@business/services/s3Storage/iS3Storage'
import { uploadConfig } from '@framework/utility/storage'

@injectable()
export class S3StorageService implements IS3StorageService {
  private publicClient: S3
  private privateClient: S3

  constructor() {
    this.publicClient = new S3({
      region: uploadConfig.public.region,
    })
    this.privateClient = new S3({
      region: uploadConfig.private.region,
    })
  }

  async savePrivateFile(file: IFile, key: string): Promise<void> {
    await this.privateClient
      .putObject({
        Bucket: uploadConfig.private.bucket,
        Key: `${process.env.STORAGE_FOLDER}/${key}`,
        Body: file.content,
        ContentType: file.mimetype,
      })
      .promise()
  }

  async deletePrivateFile(key: string): Promise<void> {
    await this.publicClient
      .deleteObject({
        Bucket: uploadConfig.private.bucket,
        Key: `${process.env.STORAGE_FOLDER}/${key}`,
      })
      .promise()
  }

  async save(file: IFile, key: string): Promise<void> {
    await this.publicClient
      .putObject({
        Bucket: uploadConfig.public.bucket,
        Key: `${process.env.STORAGE_FOLDER}/${key}`,
        ACL: 'public-read',
        Body: file.content,
        ContentType: file.mimetype,
      })
      .promise()
  }

  async delete(key: string): Promise<void> {
    await this.publicClient
      .deleteObject({
        Bucket: uploadConfig.public.bucket,
        Key: `${process.env.STORAGE_FOLDER}/${key}`,
      })
      .promise()
  }
}
