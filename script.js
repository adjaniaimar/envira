if (window.Chart) { Chart.defaults.font.family = "'Montserrat', sans-serif"; }

document.getElementById('datetime').textContent = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
setInterval(function () {
  document.getElementById('datetime').textContent = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
}, 60000);

document.querySelectorAll('.ni').forEach(function (el) {
  el.addEventListener('click', function () {
    document.querySelectorAll('.ni').forEach(function (e) { e.classList.remove('active'); });
    el.classList.add('active');
  });
});

// WEATHER OPEN METEO //
const LAT = -6.2383, LON = 107.1544;

function kategoriCuaca(code) {
  if (code === 0 || code === 1) return 'cerah';
  if (code === 2) return 'berawan-sebagian';
  if (code === 3) return 'berawan';
  if (code === 45 || code === 48) return 'kabut';
  if ([51, 53, 55, 56, 57].includes(code)) return 'gerimis';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'hujan';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'salju';
  if ([95, 96, 99].includes(code)) return 'badai';
  return 'berawan';
}
const TEKS_CUACA = {
  'cerah': 'Cerah', 'berawan-sebagian': 'Berawan Sebagian', 'berawan': 'Berawan Tebal',
  'kabut': 'Berkabut', 'gerimis': 'Gerimis', 'hujan': 'Hujan', 'salju': 'Salju', 'badai': 'Badai Petir'
};

// CUSTOM WEATHER ICONS //
function svgCuaca(kategori, isDay) {
  const sun = 'var(--yellow)', cloud = 'var(--text-muted)', rain = 'var(--rain)';
  const awan = '<ellipse cx="26" cy="38" rx="14" ry="10" fill="' + cloud + '"/><ellipse cx="40" cy="34" rx="16" ry="12" fill="' + cloud + '"/><rect x="18" y="38" width="36" height="12" rx="6" fill="' + cloud + '"/>';
  const sinarMatahari = '<circle cx="24" cy="22" r="10" fill="' + sun + '"/><g stroke="' + sun + '" stroke-width="2.5" stroke-linecap="round"><line x1="24" y1="4" x2="24" y2="9"/><line x1="8" y1="22" x2="13" y2="22"/><line x1="12" y1="10" x2="15.5" y2="13.5"/><line x1="36" y1="10" x2="32.5" y2="13.5"/></g>';
  const bulan = '<circle cx="24" cy="22" r="9" fill="' + cloud + '"/><circle cx="10" cy="14" r="1.6" fill="' + cloud + '"/><circle cx="14" cy="8" r="1.2" fill="' + cloud + '"/>';
  const matahariPenuh = '<circle cx="32" cy="32" r="13" fill="' + sun + '"/><g stroke="' + sun + '" stroke-width="3" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/><line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/><line x1="11" y1="11" x2="17" y2="17"/><line x1="47" y1="47" x2="53" y2="53"/><line x1="11" y1="53" x2="17" y2="47"/><line x1="47" y1="17" x2="53" y2="11"/></g>';
  const bulanPenuh = '<circle cx="32" cy="32" r="14" fill="' + cloud + '"/><circle cx="14" cy="18" r="2" fill="' + cloud + '"/><circle cx="20" cy="10" r="1.4" fill="' + cloud + '"/>';
  const hujanTetes = '<g stroke="' + rain + '" stroke-width="3" stroke-linecap="round"><line x1="24" y1="52" x2="20" y2="60"/><line x1="34" y1="52" x2="30" y2="60"/><line x1="44" y1="52" x2="40" y2="60"/></g>';
  const gerimisTetes = '<g fill="' + rain + '"><circle cx="24" cy="55" r="2"/><circle cx="34" cy="57" r="2"/><circle cx="44" cy="55" r="2"/></g>';
  const kabutGaris = '<g stroke="' + cloud + '" stroke-width="2.5" stroke-linecap="round" opacity=".6"><line x1="16" y1="54" x2="48" y2="54"/><line x1="20" y1="60" x2="44" y2="60"/></g>';
  const petir = '<polygon points="35,50 29,61 33,61 29,71 41,57 36,57 39,50" fill="' + sun + '"/>';

  let isi;
  if (kategori === 'cerah') isi = isDay ? matahariPenuh : bulanPenuh;
  else if (kategori === 'berawan-sebagian') isi = (isDay ? sinarMatahari : bulan) + awan;
  else if (kategori === 'kabut') isi = awan + kabutGaris;
  else if (kategori === 'gerimis') isi = awan + gerimisTetes;
  else if (kategori === 'hujan') isi = awan + hujanTetes;
  else if (kategori === 'badai') isi = awan + petir;
  else isi = awan;

  return '<svg viewBox="0 0 64 64">' + isi + '</svg>';
}

async function ambilCuaca() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day' +
      '&timezone=Asia%2FJakarta';
    const res = await fetch(url);
    if (!res.ok) throw new Error('open-meteo error');
    const data = await res.json();
    const c = data.current;
    const kategori = kategoriCuaca(c.weather_code);

    document.getElementById('weatherTemp').textContent = Math.round(c.temperature_2m);
    document.getElementById('weatherCond').textContent = TEKS_CUACA[kategori];
    document.getElementById('weatherIcon').innerHTML = svgCuaca(kategori, c.is_day === 1);
    document.getElementById('weatherFeels').textContent = Math.round(c.apparent_temperature) + '°C';
    document.getElementById('weatherHum').textContent = c.relative_humidity_2m + '%';
    document.getElementById('weatherWind').textContent = Math.round(c.wind_speed_10m) + ' km/h';
  } catch (e) {
    document.getElementById('weatherCond').textContent = 'Cuaca tidak tersedia';
  }
}
ambilCuaca();
setInterval(ambilCuaca, 10 * 60 * 1000); // WEATHER REFRESH EVERY 10 MINUTES //

// COMFORT LABELS //
function labelSuhu(t) {
  if (t < 22) return { text: 'Sejuk', cls: 'good' };
  if (t <= 28) return { text: 'Nyaman', cls: 'good' };
  if (t <= 32) return { text: 'Hangat', cls: 'warn' };
  return { text: 'Panas', cls: 'bad' };
}
function labelHum(h) {
  if (h < 40) return { text: 'Kering', cls: 'warn' };
  if (h <= 60) return { text: 'Ideal', cls: 'good' };
  if (h <= 75) return { text: 'Lembap', cls: 'warn' };
  return { text: 'Sangat Lembap', cls: 'bad' };
}

// SENSOR DATA //
const N = 20;
let riwayatSuhu = Array(N).fill(null);
let riwayatKelembapan = Array(N).fill(null);
let labelWaktu = Array(N).fill('');

const opsiChart = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { font: { size: 10 }, color: '#a89a89' }, grid: { display: false } },
    y: { ticks: { font: { size: 10 }, color: '#a89a89' }, grid: { color: 'rgba(59,36,21,.08)' } }
  },
  elements: { point: { radius: 0 } }
};

const chartTemp = new Chart(document.getElementById('chartTemp').getContext('2d'), {
  type: 'line',
  data: { labels: labelWaktu, datasets: [{ data: riwayatSuhu, borderColor: '#b5502e', backgroundColor: 'rgba(181,80,46,.08)', fill: true, borderWidth: 2, tension: 0.3, spanGaps: true }] },
  options: opsiChart
});
const chartHum = new Chart(document.getElementById('chartHum').getContext('2d'), {
  type: 'line',
  data: { labels: labelWaktu, datasets: [{ data: riwayatKelembapan, borderColor: '#6b8a3a', backgroundColor: 'rgba(107,138,58,.08)', fill: true, borderWidth: 2, tension: 0.3, spanGaps: true }] },
  options: opsiChart
});

// MIN MAX DAILY //
let hariIniJS = new Date().toDateString();
let suhuMin = null, suhuMax = null, humMin = null, humMax = null;
function terapkanMinMax(suhu, kelembapan) {
  const hariSekarang = new Date().toDateString();
  if (hariSekarang !== hariIniJS) {
    hariIniJS = hariSekarang;
    suhuMin = suhu; suhuMax = suhu;
    humMin = kelembapan; humMax = kelembapan;
  } else {
    suhuMin = suhuMin === null ? suhu : Math.min(suhuMin, suhu);
    suhuMax = suhuMax === null ? suhu : Math.max(suhuMax, suhu);
    humMin = humMin === null ? kelembapan : Math.min(humMin, kelembapan);
    humMax = humMax === null ? kelembapan : Math.max(humMax, kelembapan);
  }
  document.getElementById('tempMinMax').textContent = 'Tertinggi ' + suhuMax.toFixed(1) + '°C · Terendah ' + suhuMin.toFixed(1) + '°C';
  document.getElementById('humMinMax').textContent = 'Tertinggi ' + humMax.toFixed(1) + '% · Terendah ' + humMin.toFixed(1) + '%';
}

// PREVIEW //
function terapkanPembacaan(suhu, kelembapan, isLive) {
  document.getElementById('tempNow').textContent = suhu.toFixed(1);
  document.getElementById('humNow').textContent = kelembapan.toFixed(1);

  const ls = labelSuhu(suhu);
  const lh = labelHum(kelembapan);
  const tempStatusEl = document.getElementById('tempStatus');
  const humStatusEl = document.getElementById('humStatus');
  tempStatusEl.textContent = ls.text;
  tempStatusEl.className = 'kchg ' + ls.cls;
  humStatusEl.textContent = lh.text;
  humStatusEl.className = 'kchg ' + lh.cls;

  riwayatSuhu.push(suhu); riwayatSuhu.shift();
  riwayatKelembapan.push(kelembapan); riwayatKelembapan.shift();
  const jamSekarang = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  labelWaktu.push(jamSekarang); labelWaktu.shift();
  chartTemp.update('none');
  chartHum.update('none');

  terapkanMinMax(suhu, kelembapan);
}

// WEB SERIAL API //
let serialPort = null;
let bacaBerjalan = false;
const connectBtn = document.getElementById('connectBtn');

async function bacaDariSerial(port) {
  const reader = port.readable.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (bacaBerjalan) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const baris = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!baris.startsWith('{')) continue;
        try {
          const data = JSON.parse(baris);
          terapkanPembacaan(data.suhu, data.kelembapan, true);
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

async function hubungkanPerangkat() {
  if (!('serial' in navigator)) {
    alert('Browser ini belum mendukung Web Serial API. Pakai Google Chrome atau Microsoft Edge versi terbaru.');
    return;
  }
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 115200 });

    bacaBerjalan = true;
    connectBtn.textContent = 'Connected';
    connectBtn.classList.add('connected');

    await bacaDariSerial(serialPort);

    // READINGS LOOP STOP //
    bacaBerjalan = false;
    connectBtn.textContent = 'Hubungkan Perangkat';
    connectBtn.classList.remove('connected');
  } catch (err) {
  console.error('Web Serial Error:', err);
  alert('Gagal menghubungkan perangkat:\n' + err.message);
}
}

connectBtn.addEventListener('click', hubungkanPerangkat);

if (!('serial' in navigator)) {
  connectBtn.disabled = true;
  connectBtn.textContent = 'Web Serial Tidak Didukung';
}