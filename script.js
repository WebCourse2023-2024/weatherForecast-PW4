const apiEndpoint = "https://api.openweathermap.org/data/3.0/onecall";
const apiKey = "f6ca63f480811df3a9a6d584387439d5";
const geocodingEndpoint = "http://api.openweathermap.org/geo/1.0/direct";

marseilleLocation = {
    "lon": 5.369780,
    "lat": 43.296482
}

let oneCallUrl = new URL(apiEndpoint);
let geocodingUrl = new URL(geocodingEndpoint);

const geocodingParams = {
    "q": "Marseille, fr",
    "appid": apiKey
}

Object.keys(geocodingParams).forEach(key => geocodingUrl.searchParams.append(key, geocodingParams[key]));

const oneCallParameters  = {
    ...marseilleLocation,
    "appid": apiKey,
    "exclude": "hourly,minutely,daily"
}

Object.keys(oneCallParameters).forEach(key => oneCallUrl.searchParams.append(key, oneCallParameters[key]));

async function launchRequest(){
    try {
        const response = await fetch(oneCallUrl);
        if (!response.ok){
            console.log(response.ok)
            console.log(response);
            console.log("Request reached the server but there was")
        } else {
            const data = await response.json();
            displayCurrentWeatherDetails(data);
        }
    } catch (error) {
        console.error("Fetch error", error);
    }
}

async function findLocationCoordinates(){
    const response = await fetch(geocodingEndpoint);
    const data = await response.json();
    console.log(data);
}

//findLocationCoordinates();

function metersPerSecToKmPerHour(value) {
    return ((value * 3600) / 1000).toFixed(1);
}

function unixToDatetime(unixTime) {
    return new Date(unixTime * 1000);
}

function kelvinToDegree(kelvinTemp) {
    return (kelvinTemp - 273.15).toFixed(1);
}

function displayCurrentWeatherDetails(jsonData) {
    const currentTemp = kelvinToDegree(jsonData["current"]["temp"]);
    const feelsLikeTemp = kelvinToDegree(jsonData["current"]["feels_like"]);
    const sunsetTime = unixToDatetime(jsonData["current"]["sunset"]);
    const currentWindSpeed = metersPerSecToKmPerHour(jsonData["current"]["wind_speed"]);
    const currentWindDegree = jsonData["current"]["wind_deg"];
    const weatherDescription = jsonData["current"]["weather"][0].description;
    const calculationTime = unixToDatetime(jsonData["current"]["dt"]);

    console.log(`Actual temperature: ${currentTemp} °C\nFeels like: ${feelsLikeTemp} °C\n` +
        `Current wind speed: ${currentWindSpeed} km/h\nCurrent wind degree: ${currentWindDegree}°\n\n` +
        `Sunset time: ${sunsetTime}\nWeather description: ${weatherDescription}\n` +
        `Calculation time: ${calculationTime}\n`);
}

launchRequest();