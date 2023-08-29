'use strict'

const { DataTypes } = require('sequelize')

module.exports = {
  async up(
    /** @type {import('sequelize').QueryInterface} */ queryInterface,
    _Sequelize
  ) {
    await queryInterface.createTable('users', {
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
    })
  },

  async down(
    /** @type {import('sequelize').QueryInterface} */ queryInterface,
    _Sequelize
  ) {
    await queryInterface.dropTable('users')
  },
}
