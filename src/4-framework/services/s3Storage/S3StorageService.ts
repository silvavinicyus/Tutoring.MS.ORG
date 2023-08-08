import { IS3StorageService } from '@business/services/s3Storage/iS3Storage'
import { S3 } from 'aws-sdk'
import { injectable } from 'inversify'

interface IStorageS3 {
  filename: string
  folder: string
  fileContent: Buffer
  contentType: string
}

@injectable()
export class S3StorageService implements IS3StorageService {
  private client: S3

  constructor() {
    this.client = new S3({
      region: process.env.S3_BUCKET_REGION,
    })
  }

  async save({
    filename,
    folder,
    fileContent,
    contentType,
  }: IStorageS3): Promise<string> {
    await this.client
      .putObject({
        Bucket: `${process.env.S3_BUCKET}/${folder}`,
        Key: filename,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
        ContentEncoding: '7bit',
      })
      .promise()

    return filename
  }

  async delete(filename: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `ms-notifications/${folder}`,
        Key: filename,
      })
      .promise()
  }
}
