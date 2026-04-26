async function getWeather() {
    const lat = 42.36;
    const lon = -71.06;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=America/New_York`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather data unavailable");
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('loading').innerText = "Failed to load weather.";
    }
}

function updateUI(data) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
    // Displaying the current temperature and humidity
    document.getElementById('temp-value').innerText = data.current.temperature_2m;
    document.getElementById('humidity').innerText = data.current.relative_humidity_2m;
}

getWeather();