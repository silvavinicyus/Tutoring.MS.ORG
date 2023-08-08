import { IFooEntity } from '@domain/entities/foo'
import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utility/database'

export class Foo extends Model<IFooEntity> {}

Foo.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: 'foo',
    modelName: 'foo',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)
