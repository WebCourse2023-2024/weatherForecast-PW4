const apiEndpoint = "https://api.openweathermap.org/data/3.0/onecall";
const apiKey = "b98f7f5daacb7bcdae27b2d0b47e8e73";
const geocodingEndpoint = "http://api.openweathermap.org/geo/1.0/direct"
let oneCallUrl = new URL(apiEndpoint);
let geocodingUrl = new URL(geocodingEndpoint);
const cityName = "Marseille"
marseilleLocation = {
    "lon": 5.369780,
    "lat": 43.296482
}

const oneCallParameters  = {
    ...marseilleLocation,
    "appid": apiKey,
    "exclude": "hourly,minutely,daily"
}

const geocodingParams = {
    "q": cityName,
    "appid": apiKey
}

Object.keys(oneCallParameters).forEach(key => oneCallUrl.searchParams.append(key, oneCallParameters[key]));
Object.keys(geocodingParams).forEach(key => geocodingUrl.searchParams.append(key, geocodingParams[key]));

async function launchRequest(){
    try {
        const response = await fetch(oneCallUrl);
        if (!response.ok){
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
    try {
        const response = await fetch(geocodingUrl);
        if (!response.ok){
            console.log("Request reached the server but there was");
        } else {
            const responseReturn = await response.json();
            const data = responseReturn[0]
            displayCityCoordinates(data);
        }
    } catch (error) {
        console.error("Fetch error: error");
    }
}

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

function displayCityCoordinates(cityData){
    const longitudeCoordinate = cityData["lon"];
    const latitudeCoordinate = cityData["lat"];
    const name = cityData.name
    const state = cityData.state
    console.log("City Name: " + name + "\n" +
                "State Name: " + state + "\n\n" +
                "Longitude: " + longitudeCoordinate + "\n" +
                "Latitude: " + latitudeCoordinate);
}

//launchRequest();
findLocationCoordinates();