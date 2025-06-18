const {
  Agenda,
  Profissional,
  PessoaFisica,
  Procedimento,
  Especialidade,
} = require("../models");
const status = require("http-status");

// Inserir novo agendamento
exports.Insert = (req, res, next) => {
  const { ID_PROCED, ID_PROFISSIO, DATAABERT, SITUAGEN } = req.body;

  Agenda.create({ ID_PROCED, ID_PROFISSIO, DATAABERT, SITUAGEN })
    .then((agenda) => res.status(status.OK).send(agenda))
    .catch((error) => next(error));
};

// Buscar todos os agendamentos com joins
exports.SearchAll = async (req, res, next) => {
  try {
    const agendas = await Agenda.findAll({
      include: [
        {
          model: Profissional,
          as: "profissional",
          include: [
            {
              model: PessoaFisica,
              as: "pessoa",
              attributes: ["NOMEPESSOA"],
            },
          ],
        },
        {
          model: Procedimento,
          as: "procedimento",
          include: [
            {
              model: Especialidade,
              as: "especialidades",
              through: { attributes: [] },
              attributes: ["IDESPEC", "DESCESPEC"],
            },
          ],
        },
      ],
    });

    res.status(status.OK).send(agendas);
  } catch (error) {
    next(error);
  }
};

// Buscar um agendamento específico com joins
exports.SearchOne = (req, res, next) => {
  const id_agenda = req.params.id;

  Agenda.findByPk(id_agenda, {
    include: [
      {
        model: Profissional,
        as: "profissional",
        include: [
          {
            model: PessoaFisica,
            as: "pessoa",
            attributes: ["NOMEPESSOA"],
          },
          {
            model: Especialidade,
            as: "especialidade",
            attributes: ["DESCESPEC"],
          },
        ],
      },
      {
        model: Procedimento,
        as: "procedimento",
        // 🚫 Removido o include de especialidade, pois não existe diretamente no model
      },
    ],
  })
    .then((agenda) => {
      if (agenda) {
        res.status(status.OK).send(agenda);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

// Atualizar um agendamento
exports.Update = (req, res, next) => {
  const id_agenda = req.params.id;
  const { ID_PROCED, ID_PROFISSIO, DATAABERT, SITUAGEN } = req.body;

  Agenda.findByPk(id_agenda)
    .then((agenda) => {
      if (agenda) {
        return agenda.update({ ID_PROCED, ID_PROFISSIO, DATAABERT, SITUAGEN });
      } else {
        return res.status(status.NOT_FOUND).send();
      }
    })
    .then(() => res.status(status.OK).send())
    .catch((error) => next(error));
};

// Deletar agendamento
exports.Delete = (req, res, next) => {
  const id_agenda = req.params.id;

  Agenda.findByPk(id_agenda)
    .then((agenda) => {
      if (agenda) {
        return agenda.destroy().then(() => res.status(status.OK).send());
      } else {
        return res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

exports.getAgendamentosPorEspecialidade = async (req, res, next) => {
  try {
    const idPessoaSupervisor = req.query.idPessoa; // Recebido via query

    if (!idPessoaSupervisor) {
      return res.status(400).json({ message: "Parâmetro 'idPessoa' é obrigatório." });
    }

    // 1. Buscar o supervisor
    const supervisor = await Profissional.findOne({
      where: {
        ID_PESSOAFIS: idPessoaSupervisor,
        TIPOPROFI: 3, // técnico supervisor
      },
    });

    if (!supervisor) {
      return res.status(403).json({ message: "Supervisor não encontrado ou não autorizado." });
    }

    const idEspecialidade = supervisor.ID_CONSEPROFI;

    // 2. Buscar agendamentos dos profissionais com mesma especialidade
    const agendamentos = await Agenda.findAll({
      include: [
        {
          model: Profissional,
          required: true,
          where: { ID_CONSEPROFI: idEspecialidade },
          include: [PessoaFisica],
        },
        Procedimento,
      ],
    });

    res.json(agendamentos);
  } catch (error) {
    next(error);
  }
};