const { readTalkerData } = require('../fsHelper');

const validateTalkers = async (req, res, next) => {
  const allTalkers = await readTalkerData();
  if (allTalkers.length > 0) {
    next();
  } else {
    return res.status(200).send([]);
  }
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const emailIsValid = () => /\S+@\S+\.\S+/.test(email);
  const isValidEmail = emailIsValid();
  if (!email) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }
  if (isValidEmail === false) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }
  next();
};

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: 'Token não encontrado',
    });
  }
  if (token.length !== 16 || typeof token !== 'string') {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }
  if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (Number.isNaN(age) || !Number.isInteger(age) || age < 18) {
    return res.status(400).json({
      message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
    });
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || typeof talk !== 'object') {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório',
    });
  }
  if (!talk.watchedAt) {
    return res.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  }
  next();
};

const validateDataFormat = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const validateData = () => 
  /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/
  .test(watchedAt);
  const isValidData = validateData();
  if (isValidData === false) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
};

const validateRate = async (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (rate === undefined) {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }
  next();
};

const validateRateNumber = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!Number.isInteger(rate) || rate < 1 || rate > 5 || !rate) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

const validateTalkerId = async (req, res, next) => {
  const { id } = req.params;
  const allTalkers = await readTalkerData();
  const talker = allTalkers.find((currTalker) => currTalker.id === +id);
  if (!talker) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  next();
};

const validateQueryRate = async (req, res, next) => {
  const rate = Number(req.query.rate);
  if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

module.exports = {
  validateTalkers,
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge,
  validateRateNumber,
  validateTalk,
  validateDataFormat,
  validateRate,
  validateTalkerId,
  validateQueryRate,
};