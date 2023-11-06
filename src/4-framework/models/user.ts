import { DataTypes, Model } from 'sequelize'
import { IUserEntity } from '@domain/entities/user'
import { sequelize } from '../utility/database'
import { PostModel } from './post'
import { PostReactionsModel } from './postReactions'
import { StudyGroupModel } from './studyGroup'
import { StudyGroupLeaderModel } from './studyGroupLeader'
import { StudyGroupStudentsModel } from './studyGroupStudents'
import { TutoringModel } from './tutoring'

export class UserModel extends Model<IUserEntity> {}

UserModel.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
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
    tableName: 'users',
    modelName: 'users',
    timestamps: false,
    underscored: true,
    sequelize,
  }
)

StudyGroupModel.hasOne(UserModel, {
  foreignKey: 'id',
  sourceKey: 'creator_id',
  as: 'creator',
})

StudyGroupModel.belongsToMany(UserModel, {
  through: StudyGroupLeaderModel,
  foreignKey: 'group_id',
  as: 'leaders',
})

UserModel.belongsToMany(StudyGroupModel, {
  through: StudyGroupLeaderModel,
  foreignKey: 'leader_id',
  as: 'leader_groups',
})

StudyGroupModel.belongsToMany(UserModel, {
  through: StudyGroupStudentsModel,
  foreignKey: 'group_id',
  as: 'students',
})

UserModel.belongsToMany(StudyGroupModel, {
  through: StudyGroupStudentsModel,
  foreignKey: 'student_id',
  as: 'students_group',
})

StudyGroupModel.hasMany(PostModel, {
  foreignKey: 'group_id',
  sourceKey: 'id',
  as: 'posts',
})

PostModel.hasOne(UserModel, {
  foreignKey: 'id',
  sourceKey: 'owner_id',
  as: 'owner',
})

PostReactionsModel.hasOne(UserModel, {
  foreignKey: 'id',
  sourceKey: 'user_id',
  as: 'user',
})

PostModel.hasMany(PostReactionsModel, {
  foreignKey: 'post_id',
  sourceKey: 'id',
  as: 'reactions',
})

TutoringModel.hasOne(UserModel, {
  foreignKey: 'id',
  sourceKey: 'tutor_id',
  as: 'tutor',
})

TutoringModel.hasOne(UserModel, {
  foreignKey: 'id',
  sourceKey: 'student_id',
  as: 'student',
})
