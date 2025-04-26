
// Reemplaza con tu propia API key de OpenWeather
const apiKey = 'cebfc2984b9c5fcf27029189b654b88f';

// Función para obtener el clima basado en el input del usuario
function getWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeatherForCity(city);
    } else {
        showError('Por favor ingresa el nombre de una ciudad');
    }
}

// Función para obtener el clima de una ciudad específica
function getWeatherForCity(city) {
    // Limpia cualquier error anterior
    hideError();
    
    // Mostrar indicador de carga
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weather-container').innerHTML = '';
    
    // URL de la API con el nombre de la ciudad
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw err;
                });
            }
            return response.json();
        })
        .then(data => {
            // Ocultar indicador de carga
            document.getElementById('loading').style.display = 'none';
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Ocultar indicador de carga
            document.getElementById('loading').style.display = 'none';
            
            if (error.cod === "404") {
                showError(`Ciudad no encontrada: ${city}. Por favor verifica el nombre.`);
            } else if (error.cod === "401") {
                showError('Error de autenticación. Verifica tu API key.');
            } else if (error.cod === "429") {
                showError('Límite de solicitudes alcanzado. Inténtalo más tarde.');
            } else {
                showError('Error al obtener datos del clima: ' + (error.message || 'Desconocido'));
            }
        });
}

// Función para mostrar el clima en la página
function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    
    const temp = data.main.temp;
    const weatherDescription = data.weather[0].description;
    const cityName = data.name;
    const country = data.sys.country;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    weatherContainer.innerHTML = `
        <div class="weather-card">
            <h2>${cityName}, ${country}</h2>
            <p><img src="${iconUrl}" class="weather-icon" alt="Clima"> ${weatherDescription}</p>
            <p>🌡️ Temperatura: <strong>${temp.toFixed(1)}°C</strong></p>
            <p>💧 Humedad: ${humidity}%</p>
            <p>💨 Viento: ${windSpeed} m/s</p>
        </div>
    `;
}

// Función para mostrar mensajes de error
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Función para ocultar mensajes de error
function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.style.display = 'none';
}

// Evento para permitir búsqueda al presionar Enter
document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Cargar el clima de Monterrey automáticamente al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    getWeatherForCity('Monterrey');
});