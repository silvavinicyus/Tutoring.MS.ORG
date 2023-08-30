'use strict'

const { DataTypes } = require('sequelize')

module.exports = {
  async up(
    /** @type {import('sequelize').QueryInterface} */ queryInterface,
    _Sequelize
  ) {
    await queryInterface.createTable('tutorings', {
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
        references: {
          model: 'users',
          key: 'id',
        },
      },
      student_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })
  },

  async down(
    /** @type {import('sequelize').QueryInterface} */ queryInterface,
    _Sequelize
  ) {
    await queryInterface.dropTable('tutorings')
  },
}
