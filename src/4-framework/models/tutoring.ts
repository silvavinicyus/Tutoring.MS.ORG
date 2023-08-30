import { DataTypes, Model } from 'sequelize'
import { ITutoringEntity } from '@domain/entities/tutoring'
import { sequelize } from '../utility/database'

export class TutoringModel extends Model<ITutoringEntity> {}

TutoringModel.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tutor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    student_id: {
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
    tableName: 'tutorings',
    modelName: 'tutorings',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)
