const fs = require('fs').promises;
const path = require('path');

const TALKER_DATA_PATH = './talker.json';

const readTalkerData = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, TALKER_DATA_PATH));
    const talkers = JSON.parse(data);
    
    return talkers;
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
};

const writeTalkerData = async (newTalker) => {
  try {
    const allTalkers = JSON.stringify(newTalker, null, 2);

    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), allTalkers);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  readTalkerData,
  writeTalkerData,
};