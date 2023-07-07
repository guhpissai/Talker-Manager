const express = require('express');
const { readTalkerData, writeTalkerData } = require('./fsHelper');
const { 
  validateTalkers, 
  validateEmail,
  validatePassword,
  validateToken,
  validateName,
  validateAge, 
  validateTalk, 
  validateTalkerId, 
  validateDataFormat,
  validateRateNumber,
  validateRate,
  validateQueryRate,
} = require('./Middlewares/middlewares');
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
});

app.get('/talker/search?', validateToken, validateQueryRate, async (req, res) => {
  const searchTerm = req.query.q;
  const rate = Number(req.query.rate);
  const allTalkers = await readTalkerData();
  if (searchTerm && rate) {
    const findTalkersName = allTalkers.filter((talker) => talker.name.includes(searchTerm));
    const findTalkersRate = findTalkersName.filter((talker) => talker.talk.rate === rate);
    return res.status(200).send(findTalkersRate);
  }
  if (searchTerm) {
    const findTalkersName = allTalkers.filter((talker) => talker.name.includes(searchTerm));
    return res.status(200).send(findTalkersName);
  }
  if (rate) {
    const findTalkersRate = allTalkers.filter((talker) => talker.talk.rate === rate);
    return res.status(200).send(findTalkersRate);
  }
  return res.status(200).send(allTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const allTalkers = await readTalkerData();
  const findTalker = allTalkers.find((talker) => talker.id === +req.params.id);
  if (findTalker) {
    return res.status(200).send(findTalker);
  }
  return res.status(404).send({
    message: 'Pessoa palestrante não encontrada',
  });
});

app.post('/login', 
validateEmail, 
validatePassword, 
(req, res) => res.status(200).json({
    token: randomToken(),
  }));

app.post('/talker', 
  validateToken, 
  validateName, 
  validateAge, 
  validateTalk, 
  validateDataFormat,
  validateRate,
  validateRateNumber,
  async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const allTalkers = await readTalkerData();
    const id = allTalkers.length + 1;
    const newTalker = {
      name,
      age,
      id,
      talk: {
        watchedAt,
        rate,
      },
    };
    await writeTalkerData([...allTalkers, newTalker]);
    return res.status(201).json(newTalker);
  });

app.put('/talker/:id', 
  validateToken, 
  validateName, 
  validateAge, 
  validateTalk, 
  validateDataFormat,
  validateRate,
  validateRateNumber,
  validateTalkerId, 
  async (req, res) => {
  const { id } = req.params;
  const allTalkers = await readTalkerData();
  const talker = allTalkers.find((currTalker) => currTalker.id === +id);
  const newObject = {
    ...talker,
    ...req.body,
  };
  const newTalkers = allTalkers.filter((currTalker) => currTalker.id !== +id);
  const result = [...newTalkers, newObject];
  await writeTalkerData(result);
  return res.status(200).json(newObject);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const allTalkers = await readTalkerData();
  const talkerIndex = allTalkers.findIndex((currTalker) => currTalker.id === Number(id));
  allTalkers.splice(talkerIndex, 1);
  await writeTalkerData(allTalkers);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
