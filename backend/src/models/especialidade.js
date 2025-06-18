const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Especialidade = sequelize.define(
  "ESPECIALIDADE",
  {
    IDESPEC: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    CODESPEC: {
      type: DataTypes.STRING,
    },
    DESCESPEC: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "ESPECIALIDADE",
    timestamps: false,
  }
);

module.exports = Especialidade;
