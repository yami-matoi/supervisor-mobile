const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const EspecProced = sequelize.define(
  "ESPECPROCED",
  {
    IDESPECPROCED: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PROCED: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_ESPEC: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ESPECPROCED",
    timestamps: false,
  }
);

module.exports = EspecProced;
