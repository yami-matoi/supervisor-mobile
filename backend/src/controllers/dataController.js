const { PessoaFisica, Profissional, Especialidade } = require("../models");

exports.getProcedimentos = async (req, res, next) => {
  try {
    const procedimentos = await Procedimento.findAll({
      include: [
        {
          model: Especialidade,
          as: "especialidades",
          through: { attributes: [] }, // oculta dados da tabela ESPECPROCED
          attributes: ["IDESPEC", "DESCESPEC"],
        },
      ],
    });

    res.status(200).send(procedimentos);
  } catch (error) {
    next(error);
  }
};

// ✅ Função atualizada para incluir profissional + especialidades (via PROFI_ESPEC)
exports.getPessoaFisicaPorCpf = async (req, res, next) => {
  try {
    const pessoa = await PessoaFisica.findOne({
      where: { CPFPESSOA: req.params.cpf },
      include: [
        {
          model: Profissional,
          as: "profissionalPF",
          attributes: ["IDPROFISSIO", "TIPOPROFI", "STATUSPROFI", "ID_CONSEPROFI"],
        },
      ],
    });

    if (!pessoa) {
      return res.status(404).json({ message: "Pessoa não encontrada" });
    }

    res.json(pessoa);
  } catch (error) {
    next(error);
  }
};



exports.getProfissionaisPorEspecialidade = (req, res, next) => {
  const idEspecialidade = req.params.id;

  Profissional.findAll({
    include: [{ model: PessoaFisica, as: "pessoa" }],
  })
    .then((profissionais) => res.status(status.OK).send(profissionais))
    .catch((error) => next(error));
};