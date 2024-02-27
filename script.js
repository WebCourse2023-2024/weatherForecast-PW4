const apiEndpoint = "https://api.openweathermap.org/data/3.0/onecall";
const apiKey = "b98f7f5daacb7bcdae27b2d0b47e8e73";
const geocodingEndpoint = "https://api.openweathermap.org/geo/1.0/direct"
let oneCallUrl = new URL(apiEndpoint);
let geocodingUrl = new URL(geocodingEndpoint);
let cityName = "";
let marseilleLocation = {}
let weatherDetails = {}
let weatherIconElement = document.getElementById("icon");
let headerElement = document.querySelector("header");

function updateGeocodingSearchParams(cityName){
    const geocodingParams = {
        "q": cityName,
        "appid": apiKey
    }
    Object.keys(geocodingParams).forEach(key => geocodingUrl.searchParams.append(key, geocodingParams[key]));
}

function updateOneCallSearchParams(){
    const oneCallParameters  = {
        ...marseilleLocation,
        "appid": apiKey,
        "exclude": "hourly,minutely,daily"
    }
    Object.keys(oneCallParameters).forEach(key => oneCallUrl.searchParams.append(key, oneCallParameters[key]));
}

function metersPerSecToKmPerHour(value) {
    return ((value * 3600) / 1000).toFixed(1);
}

function kelvinToDegree(kelvinTemp) {
    return (kelvinTemp - 273.15).toFixed(1);
}

function getWeatherDetails(jsonData) {
    return {
        "currentTemp": kelvinToDegree(jsonData["current"]["temp"]),
        "feelsLikeTemp": kelvinToDegree(jsonData["current"]["temp"]),
        "windSpeed": metersPerSecToKmPerHour(jsonData["current"]["wind_speed"]),
        "description": jsonData["current"]["weather"][0].description,
        "weatherIcon": jsonData["current"]["weather"][0].icon
    }
}

async function launchRequest(cityName){
    try {
        oneCallUrl = new URL(apiEndpoint);
        await findLocationCoordinates(cityName);
        const response = await fetch(oneCallUrl);
        if (!response.ok){
            console.log("Request reached the server but there was")
        } else {
            const data = await response.json();
            weatherDetails = getWeatherDetails(data);
        }
    } catch (error) {
        console.error("Fetch error", error);
    }
}

function getCityCoordinates(cityData){
    return {
        "lon": cityData.lon,
        "lat": cityData.lat
    }
}

async function findLocationCoordinates(cityName){
    try {
        geocodingUrl = new URL(geocodingEndpoint);
        updateGeocodingSearchParams(cityName);
        const response = await fetch(geocodingUrl);
        if (!response.ok) {
            console.error("Error in weather API request:", response.statusText);
        } else {
            const responseReturn = await response.json();
            const data = responseReturn[0];
            marseilleLocation = getCityCoordinates(data);
            updateOneCallSearchParams();
        }
    } catch (error) {
        console.error("Fetch error: " + error);
    }
}

function show(element) {
    element.style.display = "";
}

function hide(element) {
    element.style.display = "none";
}

function displayWeather(weatherDetails){
    let tempElement = document.getElementById("temperature");
    let windElement = document.getElementById("wind-speed");
    let cityNameElement = document.getElementById("city-name");
    let description = document.getElementById("weather-description");
    let weatherInfoDiv = document.getElementById("weather-info");

    hide(headerElement);
    show(weatherInfoDiv);
    weatherIconElement.src = `https://openweathermap.org/img/wn/${weatherDetails.weatherIcon}@2x.png`;
    weatherIconElement.alt = weatherDetails.description;
    show(weatherIconElement);
    tempElement.innerText = `Current Temperature: ${weatherDetails.currentTemp}°C`;
    description.innerText = weatherDetails.description;
    windElement.innerText = `Wind Speed: ${weatherDetails.windSpeed} km/h`;
    cityNameElement.innerText = cityName;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

hide(weatherIconElement);
let formElement = document.querySelector("form");
formElement.addEventListener("submit", async (event) => {
    event.preventDefault();

    let inputElement = document.getElementById("city-input");
    cityName = capitalizeFirstLetter(inputElement.value.trim());

    if (cityName !== '') {
        await launchRequest(cityName);
        displayWeather(weatherDetails);
    } else {
        console.error("Please enter a valid city name");
    }
});