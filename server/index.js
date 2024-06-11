const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateLogs } = require('..');
const { tryToParseJson } = require('../tryToParseJson');
const readline = require('readline');

const app = express();

// 设置静态资源目录 
app.use(express.static(path.resolve(__dirname, '../client')));

const PORT = process.env.PORT || 4567;

const getLogs = () => {
  const logFiles = fs.readdirSync(path.resolve(__dirname, '../output'));
  const result = {};
  logFiles.forEach((file) => {
    const filePath = path.resolve(__dirname, `../output/${file}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    result[file] = JSON.parse(content);
  });
  return result;
}

const generateSourceLogs = () => {
  if (!process.argv[2]) {
    generateLogs();
    return;
  }
  if (!path.isAbsolute(process.argv[2])) {
    generateLogs(path.resolve(__dirname, `../${process.argv[2]}`));
  } else {
    generateLogs(process.argv[2]);
  }
}

const getLogsPath = () => {
  const logPath = path.join(__dirname, '../asset.log');
  if (!process.argv[2]) {
    return logPath;
  }
  if (!path.isAbsolute(process.argv[2])) {
    return path.resolve(__dirname, `../${process.argv[2]}`);
  }
  return process.argv[2];
}

const mergedSameLogs = (logs) => {
  const stringifyLogs = logs.map((item) => JSON.stringify(item));
  const mergedArr = Array.from(new Set(stringifyLogs));
  return mergedArr.map((item) => JSON.parse(item));
}

app.get('/getLogs', (_, res) => {
  res.json(getLogs());
});

app.get('/getMergedSameLogs', (_, res) => {
  const logs = getLogs();
  const result = {};
  for (const key in logs) {
    result[key] = mergedSameLogs(logs[key]);
  }
  res.json(result);
});

app.get('/getSourceLogs', (_, res) => {
  const logPath = getLogsPath();
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  const filteredLines = [];
  rl.on('line', (line) => {
    const data = tryToParseJson(line);
    filteredLines.push(data);
  });
  rl.on('close', () => {
    res.json(filteredLines);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  generateSourceLogs()
});