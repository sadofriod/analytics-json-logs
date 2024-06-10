const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { tryToParseJson } = require('./tryToParseJson');
const { writeFilteredLog } = require('./writeFilteredLog');

const logPath = path.join(__dirname, 'asset.log');

const main = async (path = logPath) => {
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const filteredLines = {};
  rl.on('line', (line) => {
    const data = tryToParseJson(line);
    if (!data) {
      return;
    }
    if (!data.level) {
      return;
    }
    if (data.level in filteredLines) {
      filteredLines[data.level].push(data);
    } else {
      filteredLines[data.level] = [data];

    }
  });

  rl.on('close', () => {
    for (const name in filteredLines) {
      writeFilteredLog(filteredLines[name].reverse(), name);
    }
  });
}
module.exports = { generateLogs: main };