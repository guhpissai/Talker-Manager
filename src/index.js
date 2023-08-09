const app = require('./app');
const connection = require('./db/connection');
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
  validateRateNumber,
  validateRate,
  validateQueryRate,
  validateDateFormat,
  validateDateQuery,
  validateTwoQuerys,
  validateAllQuerys,
  validateBodyRate,
  validateIntegerRate,
} = require('./Middlewares/middlewares');
const randomToken = require('./randomToken');

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

app.get('/talker/db', async (req, res) => {
  const [result] = await connection.execute('SELECT * FROM TalkerDB.talkers');
  const talkers = result.map((talker) => {
    return {
      name: talker.name,
      age: talker.age,
      id: talker.id,
      talk: {
        watchedAt: talker.talk_watched_at,
        rate: talker.talk_rate
      }
    }
  })
  if(!talkers) return res.status(200).send([]);
  return res.status(200).send(talkers);
})

app.get('/talker/search?', 
validateToken, 
validateQueryRate, 
validateAllQuerys,
validateTwoQuerys,
validateDateQuery, async (req, res) => {
  const searchTerm = req.query.q;
  const rate = Number(req.query.rate);
  const watchedDate = req.query.date;
  const allTalkers = await readTalkerData();
  if (searchTerm) {
    const filterByName = allTalkers.filter((talker) => talker.name.includes(searchTerm));
    return res.status(200).send(filterByName);
  }
  if (rate) {
    const filterByRate = allTalkers.filter((talker) => talker.talk.rate === rate);
    return res.status(200).send(filterByRate);
  }
  if (watchedDate) {
    const filterByDate = allTalkers.filter((talker) => talker.talk.watchedAt === watchedDate);
    return res.status(200).send(filterByDate);
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
  validateDateFormat,
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
  validateDateFormat,
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

app.patch('/talker/rate/:id', 
validateToken, validateBodyRate, validateIntegerRate, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  const allTalkers = await readTalkerData();
  const index = allTalkers.findIndex((talker) => talker.id === +id);
  const filterById = allTalkers.filter((talker) => talker.id === +id);
  filterById[0].talk.rate = rate;
  const result = [...allTalkers.slice(0, index), filterById[0], ...allTalkers.slice(index + 1)];
  writeTalkerData(result);
  return res.status(204).send();
});

app.listen(PORT, async () => {
  console.log(`TalkerDB esta sendo executado na porta ${PORT}`);
})
