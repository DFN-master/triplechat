/**
 * Arquivo: MessageController.js
 * Descrição: Arquivo responsável por controlar as ações das rotas
 * e executar os processos de usuários.
 */
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const secret = '1234';

exports.ChangeUser = async (req, res) => {
  try {
    await Usuarios.update(
      {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        active: req.body.active,
        permissions: req.body.permissions,
      },
      { where: { id: req.body.id } },
    );
    const users = await Usuarios.findAll();
    return res
      .status(201)
      .json({ status: 'sucesso', message: 'Usuário alterado com sucesso!', dados: { users } });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ status: 'erro', message: 'Não foi possivel alterar os dados do usuário' });
  }
};

exports.NewUser = async (req, res) => {
  try {
    const EmailExiste = await Usuarios.findAll({
      where: { email: req.body.email },
    });

    if (EmailExiste.length > 0) {
      console.log(EmailExiste);
      return res
        .status(201)
        .json({ status: 'erro', message: 'O Email informado já está cadastrado!', dados: {} });
    }
    await Usuarios.create(req.body);
    const users = await Usuarios.findAll();
    return res
      .status(201)
      .json({ status: 'sucesso', message: 'Cadastro realizado com sucesso!', dados: { users } });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ status: 'erro', message: 'Não foi possivel criar o usuário' });
  }
};

exports.Login = async (req, res) => {
  try {
    // Busca os dados do usuário baseado no email
    const dadosDoUsuario = await Usuarios.findAll({ where: { email: req.body.email } });
    // IF caso a busca do usuário na encontre nada
    if (dadosDoUsuario.length === 0) {
      return res
        .status(401)
        .json({ status: 'erro', message: 'Não foi possivel realizar o login - Email inválido' });
    // IF caso o usuário esteja inativo
    } if (!dadosDoUsuario[0].dataValues.active) {
      return res
        .status(401)
        .json({ status: 'erro', message: 'O usuário está inativo', dados: {} });
    // IF Caso a senha está errada
    } if (dadosDoUsuario[0].dataValues.password !== req.body.password) {
      return res
        .status(401)
        .json({ status: 'erro', message: 'Senha inválida', dados: {} });
    }
    // Login OK!
    const token = jwt.sign({ dadosDoUsuario }, secret, {
      expiresIn: 28800, // expires in 8hours
    });
    return res
      .status(201)
      .json({ status: 'sucesso', message: 'Login realizado com sucesso', dados: { jwt: token, permissoes: dadosDoUsuario[0].dataValues.permissions } });
  } catch (error) {
    logger.error("Erro ao consultar banco de dados")
    console.log(error);

    return res
      .status(401)
      .json({ status: 'erro', message: 'Não foi possivel realizar o login' });
  }
};