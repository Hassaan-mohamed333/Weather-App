const apiKey = 'ffb912a13baf4033906125300250105'; 
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const weatherCards = document.getElementById('weather-cards');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});
locationBtn.addEventListener('click', getLocation);


async function getWeatherData(query) {
    try {
        loading.style.display = 'block';
        errorMessage.style.display = 'none';
        weatherCards.innerHTML = '';

        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3&aqi=no&alerts=no`);
        
        if (!response.ok) {
            throw new Error('City not found or API error');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        weatherCards.innerHTML = '';
    } finally {
        loading.style.display = 'none';
    }
}


function displayWeather(data) {
    weatherCards.innerHTML = '';

    
    data.forecast.forecastday.forEach(day => {
        
        const date = new Date(day.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        
        const card = document.createElement('div');
        card.className = 'card';

        
        card.innerHTML = `
            <div class="day">${dayOfWeek}</div>
            <div class="date">${formattedDate}</div>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="weather-icon">
            <div class="temp">${Math.round(day.day.avgtemp_c)}°C</div>
            <div class="description">${day.day.condition.text}</div>
            <div class="details">
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <div>${day.day.avghumidity}%</div>
                    <span>Humidity</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <div>${day.day.maxwind_kph} km/h</div>
                    <span>Wind</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-temperature-high"></i>
                    <div>${Math.round(day.day.maxtemp_c)}°C</div>
                    <span>High</span>
                </div>
            </div>
        `;

        
        weatherCards.appendChild(card);
    });

    
    if (weatherCards.firstChild) {
        const cityElement = document.createElement('h2');
        cityElement.textContent = `${data.location.name}, ${data.location.country}`;
        weatherCards.firstChild.insertBefore(cityElement, weatherCards.firstChild.firstChild);
    }
}


function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        errorMessage.textContent = 'Please enter a city name';
        errorMessage.style.display = 'block';
    }
}


function getLocation() {
    if (navigator.geolocation) {
        loading.style.display = 'block';
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherData(`${lat},${lon}`);
            },
            (error) => {
                errorMessage.textContent = 'Unable to retrieve your location';
                errorMessage.style.display = 'block';
                loading.style.display = 'none';
            }
        );
    } else {
        errorMessage.textContent = 'Geolocation is not supported by your browser';
        errorMessage.style.display = 'block';
    }
}


window.addEventListener('load', () => {
    getWeatherData('Cairo');
});