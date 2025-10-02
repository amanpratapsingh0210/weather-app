# Weather Forecast Dashboard

A simple, clean, and responsive weather forecast application built with HTML, Tailwind CSS, and vanilla JavaScript. It fetches real-time weather data from the OpenWeatherMap API.

## Features

**Current Weather:** Displays the current temperature, humidity, wind speed, and weather conditions for a searched city.
**5-Day Forecast:** Shows the weather forecast for the next five days.
**Search by City:** Users can search for any city in the world to get its weather details.
**Current Location:** Fetches weather data based on the user's current geographical location.
**Search History:** Remembers the last 5 searched cities in a dropdown for quick access.
**Temperature Toggle:** Switch between Celsius and Fahrenheit for the current temperature[cite: 30].
**Responsive Design:** The interface is fully responsive and works on desktop, tablet (iPad Mini), and mobile (iPhone SE) screens[cite: 15].
**Dynamic UI:** The background changes based on the current weather conditions (e.g., a rainy background for rainy weather)[cite: 32].
**Error Handling:** Gracefully handles invalid inputs and API errors with user-friendly messages[cite: 38].

## Setup and Installation

1.  **Clone the repository:**
    bash
    git clone [https://github.com/amanpratapsingh0210/weather-app.git](https://github.com/amanpratapsingh0210/weather-app.git)
    
2.  **Navigate to the project directory:**
    bash
    cd weather-app

5.  **Open the application:**
    Simply open the `index.html` file in your web browser.

# It is recommended to yse your own API.

1.  **Get an API Key:**
    Go to [OpenWeatherMap API](https://openweathermap.org/api) and create a free account.
    Find your API key on your account page.

2.  **Add the API Key:**
    Open the `script.js` file.
    Find the line `const API_KEY = *CURRENT_API*; // USE YOUR OWN API`
    Replace the present API key with your actual API key.



## How To use

-   Type a city name in the input field and click the 'Search' button.
-   Click the 'Use Current Location' button to get weather for your location.
-   Select a previously searched city from the dropdown menu to quickly see its weather again.