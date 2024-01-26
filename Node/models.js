const { Sequelize, DataTypes } = require('sequelize');
const dbconfig = require('./db');

const sequelize = new Sequelize({
  dialect: 'postgres',
  user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'pg',
    port: 5432, // PostgreSQL default port
});

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Role = sequelize.define('roles', {
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { User, Role, sequelize };
