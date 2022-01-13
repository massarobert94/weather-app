

const cityForm = document.getElementById('cityForm');
const input = cityForm.querySelector('#cityInput');
const cityContainer = document.getElementById('cityContainer');

const button = document.getElementById('btn');
const putDescriptionHere = document.getElementById('description');
const putCurrentTempHere = document.getElementById('temp');
const putCurrentDewpointHere = document.getElementById('dewpoint');
const putWeatherEventHere = document.getElementById('weatherEvents');
const putWeatherEventDescHere = document.getElementById('eventDescription');
const putIconHere = document.getElementById('icon');
const putWeatherDescriptionHere = document.getElementById('weatherDescription');

// FormData API SAVED ME 😤😤😤😤😤😤😤😤😤
function handleSubmit(event) {
    event.preventDefault();
  
    const data = new FormData(event.target);
  
    const city = data.get('cityInput');
  
    console.log({ city });
    cityContainer.innerHTML = city;

// URL for Google GeoCoding API Call. Lat and Lon coordinates returned from call
const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyAAKTI9WyKzFDxKZDomHIrSaVP22BgzRY0`;


// Get Latitude and Longitude coordinates from given city

const sendCity = async (method, geoUrl) => {

let response = await fetch(geoUrl);
let data = await response.json();
return data;
}

const getCoordinates = async () => {
sendCity('GET', geoUrl)
.then(res => {
// Getting into data arrays / objects, pulling what we want for now (Latitude and Longitude)
    const { results } = res;
    console.log(results);
    console.log(results[0].geometry.location.lat);
    const latitude = results[0].geometry.location.lat;
    console.log(results[0].geometry.location.lng);
    const longitude = results[0].geometry.location.lng;
    // Latitude and Longitude are obtained and set as variables from previous API. These variables are passed into the API call URL to obtain weather data for those coordinates.
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly&appid=c680d0ec673f56da94ef0342e8a5212a`;
    
    // Get weather data for the given coordinates, send it to HTML
    const weatherRequest = async (method, url) => {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        return data;
    }
    // Gets current weather data, displays in HTML.
    const getCurrentData = async () => {
        weatherRequest('GET', url)
            .then(data => {
                console.log(data);
                // Display current temperature for city
                putCurrentTempHere.innerHTML = data.current.temp;
                // Display current dew point for city
                putCurrentDewpointHere.innerHTML = data.current.dew_point;
                // Icon is provided by API, given as a number/letter combo in API data.
                putIconHere.src= `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
                // Handles weather description
                putWeatherDescriptionHere.innerHTML = data.current.weather[0].description;
                // Handles Weather Alerts and displays in HTML
                if(data.alerts != null){              
                for (let i=0;i<data.alerts.length;i++){
                    putWeatherEventHere.innerHTML = data.alerts[i].event;
                    putWeatherEventDescHere.innerHTML = data.alerts[i].description;
                }
                } else {
                    putWeatherEventHere.innerHTML = 'No active alerts.';
                    putWeatherEventDescHere.innerHTML = '';
                }
            })
        }
        getCurrentData();

    })
    }
    getCoordinates();
}
cityForm.addEventListener('submit', handleSubmit);