
document.addEventListener('DOMContentLoaded', () => {

    //DOM Elements
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const historyContainer = document.getElementById('history-container');
    const historyDropdown = document.getElementById('history-dropdown');
    const errorMessage = document.getElementById('error-message');
    
    //Current Weather Elements
    const currentWeatherSection = document.getElementById('current-weather');
    const currentCity = document.getElementById('current-city');
    const currentTemp = document.getElementById('current-temp');
    const tempToggleBtn = document.getElementById('temp-toggle');
    const currentHumidity = document.getElementById('current-humidity');
    const currentWind = document.getElementById('current-wind');
    const currentIcon = document.getElementById('current-icon');
    const currentDescription = document.getElementById('current-description');
    const tempAlert = document.getElementById('temp-alert');

    //Forecast Elements
    const forecastTitle = document.getElementById('forecast-title');
    const forecastCardsContainer = document.getElementById('forecast-cards');

    //State and API
    const API_KEY = 'd1c03eb664cf46a59b6460368c266a2f';
    let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    let isCelsius = true;
    let currentWeatherData = null;

    //Functions

    //To fetch weather data from API
    const getWeatherData = async (city, lat, lon) => {
        let weatherUrl = '';
        let forecastUrl = '';

        if (city) {
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        } else {
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        }
        
        try {
            const [weatherResponse, forecastResponse] = await Promise.all([
                fetch(weatherUrl),
                fetch(forecastUrl)
            ]);

            if (!weatherResponse.ok) throw new Error(`City not found or API error: ${weatherResponse.statusText}`);
            if (!forecastResponse.ok) throw new Error(`Forecast not found or API error: ${forecastResponse.statusText}`);

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();
            
            displayCurrentWeather(weatherData);
            displayForecast(forecastData); // [cite: 34]
            updateSearchHistory(weatherData.name);
            hideError();
        } catch (error) {
            console.error('Error fetching data:', error);
            showError(error.message); // [cite: 38]
        }
    };
    
    //To display current weather
    const displayCurrentWeather = (data) => {
        currentWeatherData = data; // Store data for temperature toggle
        const date = new Date(data.dt * 1000).toLocaleDateString();
        currentCity.textContent = `${data.name} (${date})`;
        currentHumidity.textContent = `Humidity: ${data.main.humidity}%`; // [cite: 29]
        currentWind.textContent = `Wind Speed: ${data.wind.speed} m/s`; // [cite: 29]
        currentDescription.textContent = data.weather[0].description;
        currentIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // [cite: 32]
        currentIcon.alt = data.weather[0].description;
        
        updateTemperatureDisplay(); // This will display initial temp in °C
        checkExtremeTemp(data.main.temp); // [cite: 31]
        updateDynamicBackground(data.weather[0].main); // [cite: 32]
        
        currentWeatherSection.classList.remove('hidden');
    };

    //To display 5-day forecast [cite: 34]
    const displayForecast = (data) => {
        forecastCardsContainer.innerHTML = '';

        //Filter for one forecast per day
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        dailyForecasts.forEach(forecast => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-lg p-4 text-center';
            
            card.innerHTML = `
                <h4 class="font-semibold">${new Date(forecast.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}</h4>
                <p class="text-sm text-gray-400">${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="icon" class="mx-auto my-2">
                <p><i class="fas fa-thermometer-half text-red-400"></i> Temp: ${forecast.main.temp.toFixed(1)}°C</p>
                <p><i class="fas fa-wind text-blue-300"></i> Wind: ${forecast.wind.speed} m/s</p>
                <p><i class="fas fa-tint text-cyan-400"></i> Humidity: ${forecast.main.humidity}%</p>
            `;
            forecastCardsContainer.appendChild(card);
        });
        forecastTitle.classList.remove('hidden');
    };
    
    //Temperature unit toggle function
    const updateTemperatureDisplay = () => {
        if (!currentWeatherData) return;
        const temp = currentWeatherData.main.temp;
        if (isCelsius) {
            currentTemp.textContent = `${temp.toFixed(1)}°C`;
            tempToggleBtn.textContent = 'Toggle to °F';
        } else {
            const fahrenheit = (temp * 9/5) + 32;
            currentTemp.textContent = `${fahrenheit.toFixed(1)}°F`;
            tempToggleBtn.textContent = 'Toggle to °C';
        }
    };

    //Check for extreme temperature
    const checkExtremeTemp = (temp) => {
        if (temp > 40) {
            tempAlert.textContent = 'Alert: Extreme heat! Stay hydrated.';
            tempAlert.classList.remove('hidden');
        } else {
            tempAlert.classList.add('hidden');
        }
    };
    
    //Update background based on weather condition
    const updateDynamicBackground = (weatherMain) => {
        const body = document.getElementById('weather-body');
        body.className = 'bg-gray-900 text-white font-sans transition-all duration-500'; 
        //Reset classes
        if (weatherMain.toLowerCase() === 'rain') {
            body.classList.add('rainy');
        }
        
        else if (weatherMain.toLowerCase() === 'sun') {
            body.classList.add('sunny');
        }
        
        else if (weatherMain.toLowerCase() === 'cloud') {
            body.classList.add('cloudy');
        }
    };

    //Manage and display search history
    const updateSearchHistory = (city) => {
        if (!searchHistory.includes(city)) {
            //Add to the beginning
            searchHistory.unshift(city); 
            //Keep only last 5
            if (searchHistory.length > 5) searchHistory.pop(); 
            localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
        }
        renderHistoryDropdown();
    };
    
    const renderHistoryDropdown = () => {
        if (searchHistory.length === 0) {
            historyContainer.classList.add('hidden');
            return;
        }
        historyDropdown.innerHTML = '<option value="" disabled selected>Recent Searches</option>';
        searchHistory.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            historyDropdown.appendChild(option);
        });
        historyContainer.classList.remove('hidden');
    };
    
    //Error handling functions
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    };
    
    const hideError = () => {
        errorMessage.classList.add('hidden');
    };

    //Event Listeners
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city, null, null);
            cityInput.value = '';
        } else {
            showError('Please enter a city name.');
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    currentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                getWeatherData(null, latitude, longitude);
            }, error => {
                showError('Unable to retrieve your location. Please allow location access or search for a city.');
            });
        } else {
            showError('Geolocation is not supported by your browser.');
        }
    });
    
    tempToggleBtn.addEventListener('click', () => {
        isCelsius = !isCelsius;
        updateTemperatureDisplay();
    });

    historyDropdown.addEventListener('change', (e) => {
        const selectedCity = e.target.value;
        if (selectedCity) {
            getWeatherData(selectedCity, null, null);
        }
    });

    //Initial Load
    renderHistoryDropdown();
});