const apiEndpoint = "https://api.openweathermap.org/data/3.0/onecall";
const apiKey = "";

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
            console.log(data);
        }
    } catch (error) {
        console.error("Fetch error", error);
    }
}

launchRequest();