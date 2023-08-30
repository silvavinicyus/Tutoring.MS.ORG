import { DataTypes, Model } from 'sequelize'
import { IStudyGroupEntity } from '@domain/entities/studyGroup'
import { sequelize } from '../utility/database'

export class StudyGroupModel extends Model<IStudyGroupEntity> {}

StudyGroupModel.init(
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
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creator_id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'study_groups',
    modelName: 'study_groups',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)
