const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Agenda = sequelize.define(
  "AGENDA",
  {
    IDAGENDA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PESSOAFIS: DataTypes.INTEGER,
    ID_PROFISSIO: DataTypes.INTEGER,
    ID_PROCED: DataTypes.INTEGER,
    DATAABERT: DataTypes.DATE,
    // DATAFIM: DataTypes.DATE,
    // DESCRICAO: DataTypes.STRING,
    // TRANSPORTE: DataTypes.BOOLEAN,
    SITUAGEN: DataTypes.STRING,
  },
  {
    tableName: "AGENDA",
    timestamps: false,
  }
);
module.exports = Agenda;
