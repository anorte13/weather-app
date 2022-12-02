const search = document.getElementById("location");
const description = document.querySelector("weather-description");
const city = document.querySelector("weather-city");
const date = document.querySelector("weather-date");
const temp = document.querySelector("temperature");
const icon = document.querySelector("weather-icon");
//uses search value to fetch a location key from API
async function getLocationKey() {
  try {
    const locationKeyData = await fetch(
      "http://dataservice.accuweather.com/locations/v1/search/?apikey=vaPdHFsC2z5ulxbJkJXxR79TSiptn3DB&q=" +
        search.value,
      { mode: "cors" }
    );
    const keyResults = await locationKeyData.json();
    const locationKey = keyResults[0].Key;

    const locationData = await fetch(
      "http://dataservice.accuweather.com/locations/v1/" +
        locationKey +
        "?apikey=vaPdHFsC2z5ulxbJkJXxR79TSiptn3DB",
      { mode: "cors" }
    );
    const locationResults = await locationData.json();
    const cityName = locationResults.LocalizedName;
    getHourlyForecast(locationKey, cityName);
  } catch {
    console.log("Location could not be found");
  }
}
//uses the location key and gives us the forecast for that specific location
async function getHourlyForecast(key, city) {
  try {
    const hourlyForecastData = await fetch(
      "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" +
        key +
        "?apikey=vaPdHFsC2z5ulxbJkJXxR79TSiptn3DB",
      { mode: "cors" }
    );
    const hourlyForecast = await hourlyForecastData.json();
    const hourlyDes = hourlyForecast[0].IconPhrase;
    const hourlyTemp = hourlyForecast[0].Temperature.Value;
    const hourlyUnit = hourlyForecast[0].Temperature.Unit;
    const hourlyCity = city;

    console.log(hourlyForecast);
    console.log(hourlyDes);
    console.log(hourlyTemp + "" + hourlyUnit);
    console.log(hourlyCity);
  } catch {
    console.log("Could not find matching forecast with given key");
  }
}
