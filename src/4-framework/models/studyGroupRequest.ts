import { DataTypes, Model } from 'sequelize'
import { IStudyGroupRequestEntity } from '@domain/entities/studyGroupRequest'
import { sequelize } from '../utility/database'

export class StudyGroupRequestModel extends Model<IStudyGroupRequestEntity> {}

StudyGroupRequestModel.init(
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
    requester_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    group_id: {
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
    tableName: 'study_group_requests',
    modelName: 'study_group_requests',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)
