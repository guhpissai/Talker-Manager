const express = require('express');
const {readTalkerData, writeMissionData} = require('./fsHelper');
const { validateTalkers, validateLogin } = require('./Middlewares/middlewares');
const randomToken = require('./randomToken');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', validateTalkers, async (req, res) => {
  const allTalkers = await readTalkerData();
  return res.status(200).send(allTalkers);
})

app.get('/talker/:id', async (req, res) => {
  const allTalkers = await readTalkerData();
  const findTalker = allTalkers.find((talker) => talker.id === +req.params.id)
  if(findTalker) {
    return res.status(200).send(findTalker);
  }
  return res.status(404).send({
    message: "Pessoa palestrante não encontrada"
  })
})

app.post('/login', validateLogin, (req, res) => {
  return res.status(200).json({
    token: randomToken(),
  })
})

app.listen(PORT, () => {
  console.log('Online');
});
