const http = require("http");
const express = require("express");
const status = require("http-status");
const app = express();
const cors = require("cors");
const sequelize = require("./src/database/database.js");

// 🔍 Adição para inspecionar se algum controller está mal importado
const AgendaController = require("./src/controllers/agendaController.js");
const dataController = require("./src/controllers/dataController.js");
const ProfissionaisController = require("./src/controllers/profissionaisController.js");

console.log("✅ AgendaController:", Object.keys(AgendaController));
console.log("✅ dataController:", Object.keys(dataController));
console.log("✅ ProfissionaisController:", Object.keys(ProfissionaisController));

// ⚠️ Só carregue as rotas depois de verificar os controllers
const routes = require("./src/routes/routes.js");
const models = require("./src/models");

app.use(express.json());
app.use(cors());
app.use("/sistema", routes);

app.use((req, res, next) => {
  res.status(status.NOT_FOUND).send("Page not found");
});

app.use((error, req, res, next) => {
  res.status(status.INTERNAL_SERVER_ERROR).json({ error });
});

const syncDatabase = async () => {
  try {
    await models.sequelize.sync({ force: false });
    console.log("Todas as tabelas foram sincronizadas com sucesso.");

    const port = 3003;
    app.set("port", port);
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao sincronizar as tabelas:", error);
  }
};

syncDatabase();
