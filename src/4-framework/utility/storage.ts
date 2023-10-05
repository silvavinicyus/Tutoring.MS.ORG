export interface IUploadConfig {
  driver: 's3'
  public: {
    bucket: string
    region: string
  }

  private: {
    bucket: string
    region: string
  }
}

export const uploadConfig: IUploadConfig = {
  driver: process.env.STORAGE_DRIVER as IUploadConfig['driver'],
  public: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION || 'us-east-1',
  },
  private: {
    bucket: process.env.PRIVATE_S3_BUCKET,
    region: process.env.PRIVATE_S3_REGION || 'us-east-1',
  },
}
