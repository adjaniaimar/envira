if (window.Chart) { Chart.defaults.font.family = "'Montserrat', sans-serif"; }

document.getElementById('datetime').textContent = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
setInterval(function () {
  document.getElementById('datetime').textContent = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
}, 60000);

document.querySelectorAll('.ni').forEach(function (el) {
  el.addEventListener('click', function () {
    document.querySelectorAll('.ni').forEach(function (e) { e.classList.remove('active'); });
    el.classList.add('active');
  });
});

// WEATHER OPEN METEO //
const LAT = -6.2383, LON = 107.1544;

function weatherCategory(code) {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'cloudy';
}
const WEATHER_TEXT = {
  'clear': 'Clear', 'partly-cloudy': 'Partly Cloudy', 'cloudy': 'Overcast',
  'foggy': 'Foggy', 'drizzle': 'Drizzle', 'rain': 'Rain', 'snow': 'Snow', 'storm': 'Thunderstorm'
};

// CUSTOM WEATHER ICONS //
function weatherSvg(category, isDay) {
  const sun = 'var(--yellow)', cloud = 'var(--text-muted)', rain = 'var(--rain)';
  const cloudShape = '<ellipse cx="26" cy="38" rx="14" ry="10" fill="' + cloud + '"/><ellipse cx="40" cy="34" rx="16" ry="12" fill="' + cloud + '"/><rect x="18" y="38" width="36" height="12" rx="6" fill="' + cloud + '"/>';
  const sunRays = '<circle cx="24" cy="22" r="10" fill="' + sun + '"/><g stroke="' + sun + '" stroke-width="2.5" stroke-linecap="round"><line x1="24" y1="4" x2="24" y2="9"/><line x1="8" y1="22" x2="13" y2="22"/><line x1="12" y1="10" x2="15.5" y2="13.5"/><line x1="36" y1="10" x2="32.5" y2="13.5"/></g>';
  const moon = '<circle cx="24" cy="22" r="9" fill="' + cloud + '"/><circle cx="10" cy="14" r="1.6" fill="' + cloud + '"/><circle cx="14" cy="8" r="1.2" fill="' + cloud + '"/>';
  const sunFull = '<circle cx="32" cy="32" r="13" fill="' + sun + '"/><g stroke="' + sun + '" stroke-width="3" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/><line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/><line x1="11" y1="11" x2="17" y2="17"/><line x1="47" y1="47" x2="53" y2="53"/><line x1="11" y1="53" x2="17" y2="47"/><line x1="47" y1="17" x2="53" y2="11"/></g>';
  const moonFull = '<circle cx="32" cy="32" r="14" fill="' + cloud + '"/><circle cx="14" cy="18" r="2" fill="' + cloud + '"/><circle cx="20" cy="10" r="1.4" fill="' + cloud + '"/>';
  const rainDrops = '<g stroke="' + rain + '" stroke-width="3" stroke-linecap="round"><line x1="24" y1="52" x2="20" y2="60"/><line x1="34" y1="52" x2="30" y2="60"/><line x1="44" y1="52" x2="40" y2="60"/></g>';
  const drizzleDrops = '<g fill="' + rain + '"><circle cx="24" cy="55" r="2"/><circle cx="34" cy="57" r="2"/><circle cx="44" cy="55" r="2"/></g>';
  const fogLines = '<g stroke="' + cloud + '" stroke-width="2.5" stroke-linecap="round" opacity=".6"><line x1="16" y1="54" x2="48" y2="54"/><line x1="20" y1="60" x2="44" y2="60"/></g>';
  const lightning = '<polygon points="35,50 29,61 33,61 29,71 41,57 36,57 39,50" fill="' + sun + '"/>';

  let content;
  if (category === 'clear') content = isDay ? sunFull : moonFull;
  else if (category === 'partly-cloudy') content = (isDay ? sunRays : moon) + cloudShape;
  else if (category === 'foggy') content = cloudShape + fogLines;
  else if (category === 'drizzle') content = cloudShape + drizzleDrops;
  else if (category === 'rain') content = cloudShape + rainDrops;
  else if (category === 'storm') content = cloudShape + lightning;
  else content = cloudShape;

  return '<svg viewBox="0 0 64 64">' + content + '</svg>';
}

async function fetchWeather() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day' +
      '&timezone=Asia%2FJakarta';
    const res = await fetch(url);
    if (!res.ok) throw new Error('open-meteo error');
    const data = await res.json();
    const c = data.current;
    const category = weatherCategory(c.weather_code);

    document.getElementById('weatherTemp').textContent = Math.round(c.temperature_2m);
    document.getElementById('weatherCond').textContent = WEATHER_TEXT[category];
    document.getElementById('weatherIcon').innerHTML = weatherSvg(category, c.is_day === 1);
    document.getElementById('weatherFeels').textContent = Math.round(c.apparent_temperature) + '°C';
    document.getElementById('weatherHum').textContent = c.relative_humidity_2m + '%';
    document.getElementById('weatherWind').textContent = Math.round(c.wind_speed_10m) + ' km/h';
  } catch (e) {
    document.getElementById('weatherCond').textContent = 'Weather unavailable';
  }
}
fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000); // WEATHER REFRESH EVERY 10 MINUTES //

// COMFORT LABELS //
function tempLabel(t) {
  if (t < 22) return { text: 'Cool', cls: 'good' };
  if (t <= 28) return { text: 'Comfortable', cls: 'good' };
  if (t <= 32) return { text: 'Warm', cls: 'warn' };
  return { text: 'Hot', cls: 'bad' };
}
function humLabel(h) {
  if (h < 40) return { text: 'Dry', cls: 'warn' };
  if (h <= 60) return { text: 'Ideal', cls: 'good' };
  if (h <= 75) return { text: 'Humid', cls: 'warn' };
  return { text: 'Very Humid', cls: 'bad' };
}

// SENSOR DATA //
const N = 20;
let tempHistory = Array(N).fill(null);
let humHistory = Array(N).fill(null);
let timeLabels = Array(N).fill('');

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { font: { size: 10 }, color: 'rgba(1,18,7,.42)' }, grid: { display: false } },
    y: { ticks: { font: { size: 10 }, color: 'rgba(1,18,7,.42)' }, grid: { color: 'rgba(1,47,19,.08)' } }
  },
  elements: { point: { radius: 0 } }
};

const chartTemp = new Chart(document.getElementById('chartTemp').getContext('2d'), {
  type: 'line',
  data: { labels: timeLabels, datasets: [{ data: tempHistory, borderColor: '#D85A30', backgroundColor: 'rgba(216,90,48,.1)', fill: true, borderWidth: 2, tension: 0.3, spanGaps: true }] },
  options: chartOptions
});
const chartHum = new Chart(document.getElementById('chartHum').getContext('2d'), {
  type: 'line',
  data: { labels: timeLabels, datasets: [{ data: humHistory, borderColor: '#378ADD', backgroundColor: 'rgba(55,138,221,.1)', fill: true, borderWidth: 2, tension: 0.3, spanGaps: true }] },
  options: chartOptions
});

// MIN MAX DAILY //
let currentDayJS = new Date().toDateString();
let tempMinVal = null, tempMaxVal = null, humMinVal = null, humMaxVal = null;
function applyMinMax(temp, hum) {
  const today = new Date().toDateString();
  if (today !== currentDayJS) {
    currentDayJS = today;
    tempMinVal = temp; tempMaxVal = temp;
    humMinVal = hum; humMaxVal = hum;
  } else {
    tempMinVal = tempMinVal === null ? temp : Math.min(tempMinVal, temp);
    tempMaxVal = tempMaxVal === null ? temp : Math.max(tempMaxVal, temp);
    humMinVal = humMinVal === null ? hum : Math.min(humMinVal, hum);
    humMaxVal = humMaxVal === null ? hum : Math.max(humMaxVal, hum);
  }
  document.getElementById('tempMax').textContent = 'High ' + tempMaxVal.toFixed(1) + '°C';
  document.getElementById('tempMin').textContent = 'Low ' + tempMinVal.toFixed(1) + '°C';
  document.getElementById('humMax').textContent = 'High ' + humMaxVal.toFixed(1) + '%';
  document.getElementById('humMin').textContent = 'Low ' + humMinVal.toFixed(1) + '%';
}

// PREVIEW //
function applyReading(temp, hum, isLive) {
  document.getElementById('tempNow').textContent = temp.toFixed(1);
  document.getElementById('humNow').textContent = hum.toFixed(1);

  const ls = tempLabel(temp);
  const lh = humLabel(hum);
  const tempStatusEl = document.getElementById('tempStatus');
  const humStatusEl = document.getElementById('humStatus');
  tempStatusEl.textContent = ls.text;
  tempStatusEl.className = 'kchg ' + ls.cls;
  humStatusEl.textContent = lh.text;
  humStatusEl.className = 'kchg ' + lh.cls;

  tempHistory.push(temp); tempHistory.shift();
  humHistory.push(hum); humHistory.shift();
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  timeLabels.push(currentTime); timeLabels.shift();
  chartTemp.update('none');
  chartHum.update('none');

  applyMinMax(temp, hum);
}

// WEB SERIAL API //
let serialPort = null;
let isReading = false;
const connectBtn = document.getElementById('connectBtn');

async function readFromSerial(port) {
  const reader = port.readable.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (isReading) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line.startsWith('{')) continue;
        try {
          const data = JSON.parse(line);
          applyReading(data.temperature, data.humidity, true);
        } catch (err) {

        }
      }
    }
  } catch (err) {
    // PORT DISCONNECTED //
  } finally {
    reader.releaseLock();
  }
}

async function connectDevice() {
  if (!('serial' in navigator)) {
    alert('This browser does not support the Web Serial API. Please use the latest version of Google Chrome or Microsoft Edge.');
    return;
  }
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 115200 });

    isReading = true;
    connectBtn.textContent = 'Connected';
    connectBtn.classList.add('connected');

    await readFromSerial(serialPort);

    // READINGS LOOP STOP //
    isReading = false;
    connectBtn.textContent = 'Connect Device';
    connectBtn.classList.remove('connected');
  } catch (err) {
  console.error('Web Serial Error:', err);
  alert('Failed to connect device:\n' + err.message);
}
}

connectBtn.addEventListener('click', connectDevice);

if (!('serial' in navigator)) {
  connectBtn.disabled = true;
  connectBtn.textContent = 'Web Serial Not Supported';
}