const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Especialidade = require('./Especialidade')


const Medico = sequelize.define('Medicos', {
  nome: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
  rg: { type: DataTypes.STRING, allowNull: false },
  numero_classe: { type: DataTypes.STRING, allowNull: false },
  profissao: { type: DataTypes.STRING, allowNull: false }
});

Medico.belongsTo(Especialidade, { foreignKey: 'especialidadeId' , onDelete: 'SET NULL'});

module.exports = Medico;
