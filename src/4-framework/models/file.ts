import { DataTypes, Model } from 'sequelize'
import { IFileEntity } from '@domain/entities/file'
import { sequelize } from '../utility/database'

export class FileModel extends Model<IFileEntity> {}

FileModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'files',
    modelName: 'files',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)
