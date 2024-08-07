const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('./Paciente');
const Medico = require('./Medico');

const Agendamento = sequelize.define('Agendamento', {
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horario: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

Agendamento.belongsTo(Paciente, { foreignKey: 'nome_paciente', allowNull: false, onDelete: 'CASCADE' });
Agendamento.belongsTo(Medico, { foreignKey: 'nome_medico', allowNull: false, onDelete: 'CASCADE' });

module.exports = Agendamento;
