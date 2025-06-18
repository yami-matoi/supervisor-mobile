const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

// models/pessoafis.js
const pessoafis = sequelize.define(
  "PESSOAFIS",
  {
    IDPESSOAFIS: { type: DataTypes.INTEGER, primaryKey: true },
    ID_PESSOA: DataTypes.INTEGER,
    CPFPESSOA: DataTypes.STRING,
    NOMEPESSOA: DataTypes.STRING,
    DATANASCPES: DataTypes.DATE,
    SEXOPESSOA: DataTypes.STRING,
    DATACRIACAO: DataTypes.DATE,
  },
  {
    tableName: "PESSOAFIS",
    timestamps: false,
  }
);

module.exports = pessoafis;
