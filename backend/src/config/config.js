module.exports = {
  development: {
    database: {
      host: "160.20.22.99",
      port: "3360",
      user: "aluno21",
      password: "B+SFf2V0+Po=",
      database: "fasiclin",
      dialect: "mysql",
    },
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "mysql",
    },
  },
};
