const Sequelize = require("sequelize");

const environment = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[environment].database;

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: console.log,
  pool: {
    max: 5,        // máximo 5 conexões por vez
    min: 0,        // nenhuma conexão mínima
    acquire: 30000, // tempo máximo para tentar pegar uma conexão
    idle: 10000     // tempo antes de uma conexão ociosa ser liberada
  }
});

module.exports = sequelize;
