const { Profissional, PessoaFisica } = require("../models");
const status = require("http-status");

exports.Insert = (req, res, next) => {
  const { ID_PESSOAFIS, TIPOPROFI, ID_SUPPROFI, STATUSPROFI, ID_CONSEPROFI } =
    req.body;

  Profissional.create({
    ID_PESSOAFIS,
    TIPOPROFI,
    ID_SUPPROFI,
    STATUSPROFI,
    ID_CONSEPROFI,
  })
    .then((profissional) => res.status(status.OK).send(profissional))
    .catch((error) => next(error));
};

exports.SearchAll = (req, res, next) => {
  Profissional.findAll({ include: [{ model: PessoaFisica, as: "pessoa" }] })
    .then((profissionais) => res.status(status.OK).send(profissionais))
    .catch((error) => next(error));
};

exports.SearchOne = (req, res, next) => {
  const IDPROFISSIO = req.params.id;

  Profissional.findByPk(IDPROFISSIO, {
    include: [{ model: PessoaFisica, as: "pessoa" }],
  })
    .then((profissional) => res.status(status.OK).send(profissional))
    .catch((error) => next(error));
};

exports.GetNextProfId = (req, res, next) => {
  Profissional.max("IDPROFISSIO")
    .then((maxId) =>
      res.status(status.OK).json({ nextId: maxId ? maxId + 1 : 1 })
    )
    .catch((error) => next(error));
};

exports.GetSupervisores = (req, res, next) => {
  Profissional.findAll({
    where: { TIPOPROFI: 3 },
    include: [{ model: PessoaFisica, as: "pessoa" }],
  })
    .then((supervisores) => res.status(status.OK).send(supervisores))
    .catch((error) => next(error));
};
