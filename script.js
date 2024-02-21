const apiEndpoint = "https://api.openweathermap.org/data/3.0/onecall";
const apiKey = "b98f7f5daacb7bcdae27b2d0b47e8e73";

marseilleLocation = {
    "lon": 5.369780,
    "lat": 43.296482
}

let url = new URL(apiEndpoint);

const oneCallParameters  = {
    ...marseilleLocation,
    "appid": apiKey,
    "exclude": "hourly,minutely,daily"
}

Object.keys(oneCallParameters).forEach(key => url.searchParams.append(key, oneCallParameters[key]));

async function launchRequest(){
    try {
        const response = await fetch(url);
        if (!response.ok){
            console.log("Server Error")
        } else {
            const data = await response.json();
            displayCurrentWeatherDetails(data);
        }
    } catch (error) {
        console.error("Fetch error", error);
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

launchRequest();