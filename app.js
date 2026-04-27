// Mapping Open-Meteo codes to Icons and Text
const weatherCodes = {
    0: { desc: "Clear Sky", icon: "fa-sun" },
    1: { desc: "Mainly Clear", icon: "fa-cloud-sun" },
    2: { desc: "Partly Cloudy", icon: "fa-cloud" },
    3: { desc: "Overcast", icon: "fa-cloud" },
    45: { desc: "Foggy", icon: "fa-smog" },
    61: { desc: "Slight Rain", icon: "fa-cloud-rain" },
    // Add more codes as needed from documentation
};

async function fetchWeather() {
    // Boston Coordinates
    const lat = 42.36;
    const lon = -71.06;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/New_York`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderCurrent(data.current);
        renderForecast(data.daily);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function renderCurrent(current) {
    const info = weatherCodes[current.weather_code] || { desc: "Cloudy", icon: "fa-cloud" };
    document.getElementById('current-temp').innerText = Math.round(current.temperature_2m);
    document.getElementById('weather-desc').innerText = info.desc;
    document.getElementById('current-icon').className = `fas ${info.icon}`;
    document.getElementById('humidity').innerText = current.relative_humidity_2m;
    document.getElementById('wind').innerText = current.wind_speed_10m;
}

function renderForecast(daily) {
    const container = document.getElementById('forecast-list');
    container.innerHTML = ""; // Clear placeholders

    // Show next 3 days
    for (let i = 1; i <= 3; i++) {
        const info = weatherCodes[daily.weather_code[i]] || { desc: "Cloudy", icon: "fa-cloud" };
        const date = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short' });
        
        container.innerHTML += `
            <div class="forecast-card">
                <div>${date}</div>
                <i class="fas ${info.icon}"></i>
                <div class="forecast-temp">
                    ${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°
                </div>
            </div>
        `;
    }
}

fetchWeather();