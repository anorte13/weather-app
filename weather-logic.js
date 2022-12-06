const search = document.getElementById("location");
const description = document.querySelector("weather-description");
const city = document.querySelector("weather-city");
const date = document.querySelector("weather-date");
const temp = document.querySelector("temperature");
const icon = document.querySelector("weather-icon");
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
    const cityName = locationResults.LocalizedName;
    getHourlyForecast(locationKey, cityName);
  } catch {
    console.log("Location could not be found");
  }
}
//uses the location key and gives us the forecast data for that specific location
async function getHourlyForecast(key, city) {
  try {
    const hourlyForecastData = await fetch(
      "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" +
        key +
        "?apikey=vaPdHFsC2z5ulxbJkJXxR79TSiptn3DB",
      { mode: "cors" }
    );
    const hourlyForecast = await hourlyForecastData.json();
    const weatherData = processWeatherData(hourlyForecast, city);
  } catch {
    console.log("Could not find matching forecast with given key");
  }
}
//when users enters search value, we send it to the getLocationKey function
function submitWeatherLocation() {
  const location = search.value;
  getLocationKey(location);
}
function processWeatherData(weatherData, city) {
  const hourlyDes = weatherData[0].IconPhrase;
  const hourlyTemp = weatherData[0].Temperature.Value;
  const hourlyUnit = weatherData[0].Temperature.Unit;
  const hourlyCity = city;

  console.log(hourlyDes);
  console.log(hourlyTemp + "" + hourlyUnit);
  console.log(hourlyCity);
}
