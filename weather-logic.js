const search = document.getElementById("location");
async function getLocationKey() {
  try {
    const response = await fetch(
      "http://dataservice.accuweather.com/locations/v1/search/?apikey=vaPdHFsC2z5ulxbJkJXxR79TSiptn3DB&q=" +
        search.value,
      { mode: "cors" }
    );
    const results = await response.json();
    const locationKey = results[0].Key;
    return locationKey;
  } catch {
    console.log("Location could not be found");
  }
}
async function getForecast() {}
