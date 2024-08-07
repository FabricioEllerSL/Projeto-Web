const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Medico = sequelize.define('Medicos', {
  nome: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
  rg: { type: DataTypes.STRING, allowNull: false },
  numero_classe: { type: DataTypes.STRING, allowNull: false },
  profissao: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Medico;
