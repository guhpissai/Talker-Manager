const { readTalkerData } = require('../fsHelper')

const validateTalkers = async (req, res, next) => {
  const allTalkers = await readTalkerData()
  if(allTalkers.length > 0) {
    next()
  } else {
    return res.status(200).send([])
  }
}

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const emailIsValid = () => /\S+@\S+\.\S+/.test(email);
  const isValidEmail = emailIsValid();
  if(!email) {
    return res.status(400).json({
      "message": "O campo \"email\" é obrigatório"
    })
  }
  if(isValidEmail === false) {
    return res.status(400).json({
      "message": "O \"email\" deve ter o formato \"email@email.com\""
    })
  }
  if(!password) {
    return res.status(400).json({
      "message": "O campo \"password\" é obrigatório"
    })
  }
  if(password.length < 6) {
    return res.status(400).json({
      "message": "O \"password\" deve ter pelo menos 6 caracteres"
    })
  }
  next()
}

const validateTalker = (req, res, next) => {
  const { name, age, talk: {watchedAt, rate } } = req.body;
  const { token } = req.headers;
  const validateData = () => /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(watchedAt);
  const isValidData = validateData();
  if(!token) {
    return res.status(401).json({
      "message": "Token não encontrado"
    })
  }
  if(!token.length === 16) {
    return res.status(401).json({
      "message": "Token inválido"
    })
  }
  if(!name) {
    return res.status(400).json({
      "message": "O campo \"name\" é obrigatório"
    })
  }
  if(name.length < 3) {
    return res.status(400).json({
      "message": "O \"name\" deve ter pelo menos 3 caracteres"
    })
  }
  if(!age) {
    return res.status(400).json({
      "message": "O campo \"age\" é obrigatório"
    })
  }
  if(!Number.isNaN(age) || !Number.isInteger(age) || age > 18) {
    return res.status(400).json({
      "message": "O campo \"age\" deve ser um número inteiro igual ou maior que 18"
    })
  }
  if(!talk) {
    return res.status(400).json({
      "message": "O campo \"talk\" é obrigatório"
    })
  }
  if(!watchedAt) {
    return res.status(400).json({
      "message": "O campo \"watchedAt\" é obrigatório"
    })
  }
  if(isValidData === false) {
    return res.status(400).json({
      "message": "O campo \"watchedAt\" deve ter o formato \"dd/mm/aaaa\""
    })
  }
  if(!rate) {
    return res.status(400).json({
      "message": "O campo \"rate\" é obrigatório"
    })
  }
  if(!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(400).json({
      "message": "O campo \"rate\" deve ser um número inteiro entre 1 e 5"
    })
  }
  next();
}

module.exports = {
  validateTalkers,
  validateLogin
};