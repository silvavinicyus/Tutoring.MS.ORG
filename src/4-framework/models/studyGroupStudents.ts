import { DataTypes, Model } from 'sequelize'
import { IStudyGroupStudentsEntity } from '@domain/entities/studyGroupStudents'
import { sequelize } from '../utility/database'

export class StudyGroupStudentsModel extends Model<IStudyGroupStudentsEntity> {}

StudyGroupStudentsModel.init(
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
    student_id: {
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
    tableName: 'study_group_students',
    modelName: 'study_group_students',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)
