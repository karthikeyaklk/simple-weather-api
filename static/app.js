const $ = (id) => document.getElementById(id);

const weatherCodes = {
  0: ["Clear sky", "☀"], 1: ["Mainly clear", "🌤"], 2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁"], 45: ["Fog", "🌫"], 48: ["Depositing rime fog", "🌫"],
  51: ["Light drizzle", "🌦"], 53: ["Drizzle", "🌦"], 55: ["Dense drizzle", "🌧"],
  56: ["Freezing drizzle", "🌧"], 57: ["Dense freezing drizzle", "🌧"],
  61: ["Slight rain", "🌦"], 63: ["Moderate rain", "🌧"], 65: ["Heavy rain", "🌧"],
  66: ["Freezing rain", "🌧"], 67: ["Heavy freezing rain", "🌧"],
  71: ["Slight snow", "🌨"], 73: ["Moderate snow", "🌨"], 75: ["Heavy snow", "❄"],
  77: ["Snow grains", "🌨"], 80: ["Rain showers", "🌦"], 81: ["Moderate showers", "🌧"],
  82: ["Violent showers", "⛈"], 85: ["Snow showers", "🌨"], 86: ["Heavy snow showers", "🌨"],
  95: ["Thunderstorm", "⛈"], 96: ["Thunderstorm with hail", "⛈"], 99: ["Severe thunderstorm", "⛈"]
};

function setStatus(message, isError = false) {
  $("status").textContent = message;
  $("status").style.color = isError ? "#ff9caa" : "";
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (${response.status}). Please try again.`);
  return response.json();
}

async function loadWeather(city) {
  const button = $("search-button");
  button.disabled = true;
  setStatus("Finding location and fetching live weather…");
  try {
    const geo = await getJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if (!geo.results || !geo.results.length) throw new Error("Location not found. Try another city name.");
    const loc = geo.results[0];
    const params = new URLSearchParams({
      latitude: loc.latitude, longitude: loc.longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto", forecast_days: "5"
    });
    const data = await getJson(`https://api.open-meteo.com/v1/forecast?${params}`);
    renderWeather(loc, data);
    setStatus(`Live weather loaded for ${loc.name}.`);
  } catch (err) {
    setStatus(err.message || "Could not load weather.", true);
  } finally {
    button.disabled = false;
  }
}

function renderWeather(loc, data) {
  const c = data.current;
  const [description, icon] = weatherCodes[c.weather_code] || ["Weather conditions", "🌤"];
  $("place-name").textContent = `${loc.name}${loc.admin1 ? ", " + loc.admin1 : ""}, ${loc.country}`;
  $("updated-at").textContent = `Updated ${c.time.replace("T", " ")} (local time)`;
  $("weather-icon").textContent = icon;
  $("temperature").textContent = Math.round(c.temperature_2m);
  $("condition").textContent = `${description} · Feels like ${Math.round(c.apparent_temperature)}°C`;
  $("humidity").textContent = `${c.relative_humidity_2m}%`;
  $("wind").textContent = `${Math.round(c.wind_speed_10m)} km/h`;
  $("pressure").textContent = `${Math.round(c.pressure_msl)} hPa`;
  $("precipitation").textContent = `${c.precipitation} mm`;


  $("forecast-list").innerHTML = data.daily.time.map((date, i) => {
    const [desc, symbol] = weatherCodes[data.daily.weather_code[i]] || ["Conditions", "🌤"];
    const day = i === 0 ? "Today" : new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" });
    const rain = data.daily.precipitation_probability_max[i];
    return `<div class="forecast-row" title="${desc}">
      <span class="forecast-day">${day}</span><span class="forecast-symbol">${symbol}</span>
      <span class="forecast-temp">${Math.round(data.daily.temperature_2m_max[i])}° / ${Math.round(data.daily.temperature_2m_min[i])}°</span>
      <span class="forecast-rain">${rain ?? "—"}% ☂</span>
    </div>`;
  }).join("");
}

$("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const city = $("city-input").value.trim();
  if (city) loadWeather(city);
});

loadWeather("Visakhapatnam");
