const apiKey = "ee8203485231b4b5de602e6ff44459bc";

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  getCurrentWeather(city);
  getForecast(city);
});

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

        forecastHTML += `<p>${day}: Temperature: ${maxTemperature} ºF, Humidity: ${maxHumidity}%, Wind Speed: ${maxWindSpeed} mph</p>`;
      }

      document.getElementById("forecast").innerHTML = forecastHTML;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
  saveSearchedCity(city);
}

function groupForecastsByDay(forecastList) {
  const dailyForecasts = {};

  for (const forecast of forecastList) {
    const date = dayjs(forecast.dt_txt).format("YYYY-MM-DD");
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(forecast);
  }

  return dailyForecasts;
}

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

function displaySearchedCities(searchedCities) {
  const searchedCitiesList = document.getElementById("searchedCities");
  searchedCitiesList.innerHTML = "";

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
