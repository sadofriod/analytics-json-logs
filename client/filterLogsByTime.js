
const fromTime = document.getElementById('startTime');
const toTime = document.getElementById('endTime');
const timeFilter = document.getElementById('time-filter-logs-btn');

const filterLogsByTime = (logs, startTime, endTime) => {
  return logs.filter((log) => {
    const logTime = dayjs(log.time);
    return logTime.isAfter(startTime) && logTime.isBefore(endTime);
  });
}
timeFilter.addEventListener('click', async () => {
  const filteredLogs = {};
  for (const key in logs) {
    filteredLogs[key] = filterLogsByTime(logs[key], dayjs(fromTime.value), dayjs(toTime.value));
  }
  container.innerHTML = '';
  renderLogs(filteredLogs);
});

const initialTime = async () => {
  const res = await fetch('/getSourceLogs');
  const logs = await res.json();
  const filteredLogs = logs.filter((log) => log);
  console.log(filteredLogs, filteredLogs[filteredLogs.length - 1]);
  const startTime = filteredLogs[0].time;
  const endTime = filteredLogs[filteredLogs.length - 1].time;
  fromTime.value = dayjs(startTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
  toTime.value = dayjs(endTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
}

initialTime()