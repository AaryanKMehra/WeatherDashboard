const weatherCodes = {
    0: { desc: "Clear Sky", icon: "fa-sun" },
    1: { desc: "Partly Cloudy", icon: "fa-cloud-sun" },
    2: { desc: "Cloudy", icon: "fa-cloud" },
    3: { desc: "Overcast", icon: "fa-cloud" },
    45: { desc: "Foggy", icon: "fa-smog" },
    61: { desc: "Rainy", icon: "fa-cloud-showers-heavy" },
    71: { desc: "Snowy", icon: "fa-snowflake" },
    95: { desc: "Stormy", icon: "fa-bolt" }
};

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

// 1. Initial Load from LocalStorage or Default (Boston)
window.onload = () => {
    const savedCity = localStorage.getItem('preferredCity') || "Boston";
    getCoordinates(savedCity);
};

searchBtn.addEventListener('click', () => getCoordinates(cityInput.value));

// 2. Geocoding: Get Lat/Lon from City Name
async function getCoordinates(city) {
    if (!city) return;
    toggleLoading(true);
    
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const res = await fetch(geoUrl);
        const data = await res.json();

        if (!data.results) throw new Error("City not found");
        
        const { latitude, longitude, name, admin1 } = data.results[0];
        document.getElementById('city-name').innerText = `${name}, ${admin1 || ''}`;
        document.getElementById('error-message').style.display = 'none';
        
        localStorage.setItem('preferredCity', name);
        fetchWeather(latitude, longitude);
    } catch (err) {
        document.getElementById('error-message').style.display = 'block';
        toggleLoading(false);
    }
}

// 3. Fetch Weather Data
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderUI(data);
    } catch (err) {
        console.error("Weather fetch failed");
    } finally {
        toggleLoading(false);
    }
}

function renderUI(data) {
    const current = data.current;
    const info = weatherCodes[current.weather_code] || { desc: "Cloudy", icon: "fa-cloud" };
    
    document.getElementById('current-temp').innerText = Math.round(current.temperature_2m);
    document.getElementById('weather-desc').innerText = info.desc;
    document.getElementById('current-icon').className = `fas ${info.icon}`;
    document.getElementById('humidity').innerText = current.relative_humidity_2m;
    document.getElementById('wind').innerText = Math.round(current.wind_speed_10m);

    // Render 3-Day Forecast
    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = "";
    for (let i = 1; i <= 3; i++) {
        const dayInfo = weatherCodes[data.daily.weather_code[i]] || { icon: "fa-cloud" };
        const date = new Date(data.daily.time[i]).toLocaleDateString('en-US', { weekday: 'short' });
        
        forecastList.innerHTML += `
            <div class="forecast-card">
                <strong>${date}</strong>
                <i class="fas ${dayInfo.icon}" style="display:block; margin: 8px 0;"></i>
                <span>${Math.round(data.daily.temperature_2m_max[i])}° / ${Math.round(data.daily.temperature_2m_min[i])}°</span>
            </div>
        `;
    }
}

function toggleLoading(isLoading) {
    document.getElementById('loading-spinner').style.display = isLoading ? 'block' : 'none';
    document.getElementById('weather-content').style.visibility = isLoading ? 'hidden' : 'visible';
}