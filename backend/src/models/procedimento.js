const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Procedimento = sequelize.define(
  "PROCEDIMENTO",
  {
    IDPROCED: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    CODPROCED: {
      type: DataTypes.STRING,
    },
    DESCRPROC: {
      type: DataTypes.STRING,
    },
    VALORPROC: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    tableName: "PROCEDIMENTO",
    timestamps: false,
  }
);

module.exports = Procedimento;
