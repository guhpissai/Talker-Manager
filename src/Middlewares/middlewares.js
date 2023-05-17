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

module.exports = {
  validateTalkers,
  validateLogin
};