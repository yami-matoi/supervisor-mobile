const express = require("express");
const router = express.Router();

const AgendaController = require("../controllers/agendaController.js");
const dataController = require("../controllers/dataController.js");
const ProfissionaisController = require("../controllers/profissionaisController.js");

// ──────────────── ROTAS DE DADOS (DATA CONTROLLER) ────────────────

// Buscar profissionais por especialidade
router.get(
  "/especialidade/:especialidadeId/profissionais",
  dataController.getProfissionaisPorEspecialidade
);

// ❌ ROTA REMOVIDA: Buscar procedimentos por especialidade com função errada

// Buscar pessoa física pelo CPF
router.get("/pessoafisica/cpf/:cpf", dataController.getPessoaFisicaPorCpf);

// Listar especialidades e procedimentos
//router.get("/especialidades", dataController.getEspecialidades);
router.get("/procedimentos", dataController.getProcedimentos);

// ──────────────── ROTAS DE AGENDA ────────────────

router.post("/agenda", AgendaController.Insert);
router.get("/agenda", AgendaController.SearchAll);
router.get("/agenda/:id", AgendaController.SearchOne);
router.put("/agenda/:id", AgendaController.Update);
router.delete("/agenda/:id", AgendaController.Delete);

// Rota para supervisores verem agendamentos por especialidade
router.get(
  "/agenda/supervisor",
  AgendaController.getAgendamentosPorEspecialidade
);

// ──────────────── ROTAS DE PROFISSIONAL ────────────────

router.get("/profissionais/", ProfissionaisController.SearchAll);
router.get("/profissionais/nextId", ProfissionaisController.GetNextProfId);
router.get(
  "/profissionais/supervisores",
  ProfissionaisController.GetSupervisores
);
router.get("/profissionais/:id", ProfissionaisController.SearchOne);
router.post("/cadastro_profissional", ProfissionaisController.Insert);

module.exports = router;
