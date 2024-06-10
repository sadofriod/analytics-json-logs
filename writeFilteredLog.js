const path = require('path');
const fs = require('fs');

const writeFilteredLog = (log, name) => {
  if (!name) return;
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const filteredLogPath = path.join(__dirname, `output/${name}.log`);
  fs.writeFileSync(filteredLogPath, JSON.stringify(log));
};

module.exports = { writeFilteredLog };