const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Especialidade = sequelize.define('Especialidade', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Especialidade;
