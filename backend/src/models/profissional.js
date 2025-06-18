// models/profissional.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Profissional = sequelize.define(
  "PROFISSIONAL",
  {
    IDPROFISSIO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PESSOAFIS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TIPOPROFI: DataTypes.STRING,
    ID_SUPPROFI: DataTypes.INTEGER,
    STATUSPROFI: DataTypes.STRING,
    ID_CONSEPROFI: DataTypes.INTEGER,
    /* ID_ESPEC: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, */
  },
  {
    tableName: "PROFISSIONAL",
    timestamps: false,
  }
);

module.exports = Profissional;
