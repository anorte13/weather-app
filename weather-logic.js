const search = document.getElementById("location");
//uses search value to fetch a location key from API to send to the getForecast function
async function getLocationKey(location) {
  try {
    const locationKeyData = await fetch(
      "http://dataservice.accuweather.com/locations/v1/search/?apikey=vaPdHFsC2z5ulxbJkJXxR79TSiptn3DB&q=" +
        location,
      { mode: "cors" }
    );
    const keyResults = await locationKeyData.json();
    const locationKey = keyResults[0].Key;

    const locationName = await fetch(
      "http://dataservice.accuweather.com/locations/v1/" +
        locationKey +
        "?apikey=vaPdHFsC2z5ulxbJkJXxR79TSiptn3DB",
      { mode: "cors" }
    );
    const locationResults = await locationName.json();
    const locationString = locationResults.LocalizedName;
    const countryName = locationResults.Country.LocalizedName;
    const cityName = locationString + ", " + countryName;
    getCurrentForecast(locationKey, cityName);
  } catch {
    console.log("Location could not be found");
  }
}
//uses the location key and gives us the forecast data for that specific location
async function getCurrentForecast(key, city) {
  try {
    const currentForecastData = await fetch(
      "http://dataservice.accuweather.com/currentconditions/v1/" +
        key +
        "?apikey=vaPdHFsC2z5ulxbJkJXxR79TSiptn3DB",
      { mode: "cors" }
    );
    const currentForecast = await currentForecastData.json();
    const weatherData = await processCurrentWeatherData(currentForecast, city);
    displayData(weatherData);
  } catch {
    console.log("Could not find matching forecast with given key");
  }
}
//when users enters search value, we send it to the getLocationKey function
function submitWeatherLocation() {
  const location = search.value;
  getLocationKey(location);
}
//processes weather data and creates data object and returns value for current conditions
function processCurrentWeatherData(weatherData, city) {
  const currentTimeData = weatherData[0].EpochTime;
  const convertedTime = currentTimeData * 1000;
  const myData = {
    conditions: weatherData[0].WeatherText,
    city: city,
    time: convertEpochTime(convertedTime),
    temperature: weatherData[0].Temperature.Imperial.Value,
    units: weatherData[0].Temperature.Imperial.Unit,
  };
  return myData;
}
//converts epoch time from API call and returns human-readable time format in current timezone
function convertEpochTime(time) {
  let dateObject = new Date(time);
  let timeStamp = dateObject.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
    dateObject
  );
  const mo = new Intl.DateTimeFormat("en", { month: "numeric" }).format(
    dateObject
  );
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
    dateObject
  );

  let fullDateTime = `${mo}/${da}/${ye} ${timeStamp}`;
  return fullDateTime;
}
async function displayData(data) {
  const description = document.querySelector(".weather-description");
  const city = document.querySelector(".weather-city");
  const date = document.querySelector(".weather-date");
  const temp = document.querySelector(".temperature");
  const icon = document.querySelector(".weather-icon");
  try {
    description.textContent = data.conditions;
    city.textContent = data.city;
    date.textContent = data.time;
    temp.textContent = data.temperature + " " + data.units + "°";
  } catch {
    console.log("Error");
  }
}
