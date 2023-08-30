import { DataTypes, Model } from 'sequelize'
import { IStudyGroupLeaderEntity } from '@domain/entities/studyGroupLeader'
import { sequelize } from '../utility/database'

export class StudyGroupLeaderModel extends Model<IStudyGroupLeaderEntity> {}

StudyGroupLeaderModel.init(
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
    leader_id: {
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
    tableName: 'study_group_leaders',
    modelName: 'study_group_leaders',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)
