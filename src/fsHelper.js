const fs = require('fs').promises;
const path = require('path');

const TALKER_DATA_PATH = './talker.json';

const readTalkerData = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, TALKER_DATA_PATH));
    const missions = JSON.parse(data)
    
    return missions
  } catch(error) {
    console.error(`Erro na leitura do arquivo: ${error}`)
  }
}

const writeMissionData = async (newTalker) => {
  try {
    const oldtTalkers = await readTakerData();
    const allTalkers = JSON.stringify([...oldtTalkers, newTalker]);

    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), allTalkers);

  } catch(error) {
    console.log(error)
  }
}

module.exports = {
  readTalkerData,
  writeMissionData
};