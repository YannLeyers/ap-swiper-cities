import { apiKey } from './key.js'

const cities = ['Oaxaca de Juárez', 'Lviv', 'Tbilisi', 'Chefchaouen', 'Valparaiso'];
const weather = document.querySelector('.weather');

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data.main.temp;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function updateSlider() {
    weather.innerHTML = '';

    for (const city of cities) {
        const temperature = await getWeather(city);
        const cityElement = document.createElement('div');
        cityElement.textContent = `${city}: ${temperature}°C`;
        weather.appendChild(cityElement);
    }

}

updateSlider();