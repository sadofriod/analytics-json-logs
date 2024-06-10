const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateLogs } = require('..');

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (!process.argv[2]) {
    generateLogs();
    return;
  }
  if (!path.isAbsolute(process.argv[2])) {
    generateLogs(path.resolve(__dirname, `../${process.argv[2]}`));
  } else {
    generateLogs(process.argv[2]);
  }
});