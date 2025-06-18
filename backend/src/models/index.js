const sequelize = require("../database/database");

const Especialidade = require("./especialidade");
const Procedimento = require("./procedimento");
const EspecProced = require("./especproced");
const PessoaFisica = require("./pessoafis");
const Profissional = require("./profissional");
const Agenda = require("./agenda");

// ──────────────── RELACIONAMENTOS ──────────────── //

// AGENDA → PROFISSIONAL
Agenda.belongsTo(Profissional, {
  foreignKey: "ID_PROFISSIO",
  as: "profissional",
});

// AGENDA → PROCEDIMENTO
Agenda.belongsTo(Procedimento, {
  foreignKey: "ID_PROCED",
  as: "procedimento",
});

// PROFISSIONAL → PESSOAFIS
Profissional.belongsTo(PessoaFisica, {
  foreignKey: "ID_PESSOAFIS",
  as: "pessoa",
});

// ✅ PessoaFisica → PROFISSIONAL
PessoaFisica.hasOne(Profissional, {
  foreignKey: "ID_PESSOAFIS",
  as: "profissionalPF",
});

// PROFISSIONAL → ESPECIALIDADE (relacionamento direto de volta)
Profissional.belongsTo(Especialidade, {
  foreignKey: "ID_CONSEPROFI",
  as: "especialidade",
});

// ⚠️ IMPORTANTE: Retirado o belongsTo direto entre Procedimento → Especialidade
// pois ele entraria em conflito com o relacionamento via tabela associativa.

// ESPECIALIDADE ⇄ PROCEDIMENTO via ESPECPROCED
Especialidade.belongsToMany(Procedimento, {
  through: EspecProced,
  foreignKey: "ID_ESPEC",
  otherKey: "ID_PROCED",
  as: "procedimentos",
});

Procedimento.belongsToMany(Especialidade, {
  through: EspecProced,
  foreignKey: "ID_PROCED",
  otherKey: "ID_ESPEC",
  as: "especialidades",
});

// ESPECPROCED → ESPECIALIDADE
EspecProced.belongsTo(Especialidade, {
  foreignKey: "ID_ESPEC",
  as: "especialidade",
});

// ESPECPROCED → PROCEDIMENTO
EspecProced.belongsTo(Procedimento, {
  foreignKey: "ID_PROCED",
  as: "procedimento",
});

// ──────────────── EXPORT ──────────────── //

module.exports = {
  sequelize,
  Especialidade,
  Procedimento,
  EspecProced,
  PessoaFisica,
  Profissional,
  Agenda,
};
