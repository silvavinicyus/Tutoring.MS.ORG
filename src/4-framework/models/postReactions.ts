import { DataTypes, Model } from 'sequelize'
import { IPostReactionEntity } from '@domain/entities/postReactions'
import { sequelize } from '../utility/database'

export class PostReactionsModel extends Model<IPostReactionEntity> {}

PostReactionsModel.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    user_id: {
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
    tableName: 'post_reactions',
    modelName: 'post_reactions',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)
