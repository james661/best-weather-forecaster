// Puts my API key into a set variable for easy access later
const apiKey = "ee8203485231b4b5de602e6ff44459bc";
// Begins a function when submitting that grabs the values of a city if typed in
document.querySelector("form").addEventListener("submit", function (sub) {
  sub.preventDefault();
  const city = document.getElementById("cityInput").value;
  getCurrentWeather(city);
  getForecast(city);
});
// Function that fetches the current weather data for the searched city
function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const weather = `Temperature: ${temperature} ºF, Humidity: ${humidity}%, Wind Speed: ${windSpeed} mph`;
      document.getElementById("currentWeather").textContent = weather;
    })
    .catch((error) => {
      console.error(error);
    });
}
// Function that fetches the weather data for the next 5 days.
function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const forecastList = data.list;
      let forecastHTML = "";

      // Group forecast data by day put in a variable
      const dailyForecasts = groupForecastsByDay(forecastList);

      // Display maximum temperature, humidity, and wind speed for each day
      let dayCount = 0;
      for (const [day, forecasts] of Object.entries(dailyForecasts)) {
        const maxTemperature = Math.max(
          ...forecasts.map((forecast) => forecast.main.temp)
        );
        const maxHumidity = Math.max(
          ...forecasts.map((forecast) => forecast.main.humidity)
        );
        const maxWindSpeed = Math.max(
          ...forecasts.map((forecast) => forecast.wind.speed)
        );
        // Displays the weather data for each day
        forecastHTML += `<p>${day}: Temperature: ${maxTemperature} ºF, Humidity: ${maxHumidity}%, Wind Speed: ${maxWindSpeed} mph</p>`;
        // Halts the function so no more than 5 days are shown
        dayCount++;
        if (dayCount >= 5) {
          break;
        }
      }

      document.getElementById("forecast").innerHTML = forecastHTML;
    })
    // Shows an error if the API doesn't load properly
    .catch((error) => {
      console.log("Error:", error);
    });
  // Saves each searched city in local storage, using a function coded below
  saveSearchedCity(city);
}
// Function that groups forecast items based on their dates
function groupForecastsByDay(forecastList) {
  const dailyForecasts = {};

  for (const forecast of forecastList) {
    const date = dayjs(forecast.dt_txt).format("MMMM-DD-YYYY");
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(forecast);
  }

  return dailyForecasts;
}
// Function that saves cities that have been searched
function saveSearchedCity(city) {
  let searchedCities = localStorage.getItem("searchedCities");
  if (searchedCities) {
    searchedCities = JSON.parse(searchedCities);
    if (!searchedCities.includes(city)) {
      searchedCities.push(city);
    }
  } else {
    searchedCities = [city];
  }

  localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

  displaySearchedCities(searchedCities);
}
// Function that displays the previously searched cities
function displaySearchedCities(searchedCities) {
  const searchedCitiesList = document.getElementById("searchedCities");
  searchedCitiesList.innerHTML = "";
  // Creates a list for the previously searched cities
  for (const city of searchedCities) {
    const li = document.createElement("li");
    li.textContent = city;
    searchedCitiesList.appendChild(li);
  }
}

// Display previously searched cities upon loading of page
document.addEventListener("DOMContentLoaded", function () {
  const searchedCities = localStorage.getItem("searchedCities");
  if (searchedCities) {
    displaySearchedCities(JSON.parse(searchedCities));
  }
});
