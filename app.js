// Grab all elements from the DOM and make them variables I can work with

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
const putWindspeedHere = document.getElementById('windSpeed');
const putFeelsLikeHere = document.getElementById('feelsLike');
const putImperialHere = document.getElementById('imp');
const putMetricHere = document.getElementById('met');

const putTodaysDateHere = document.getElementById('todaysDate');

// FormData API SAVED ME 😤😤😤😤😤😤😤😤😤
function handleSubmit(event) {
    event.preventDefault();
  
    const data = new FormData(event.target);
  
    const city = data.get('cityInput');
  
    console.log({ city });
    cityContainer.innerHTML = city;

// URL for Google GeoCoding API Call. Lat and Lon coordinates returned from call
const geoApiKey = config.GEO_KEY;
const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${geoApiKey}`;


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
    const apiKey = config.WEATHER_KEY;
    const units = (putImperialHere.checked == true) ? 'imperial': 'metric';

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${units}&exclude=minutely,hourly&appid=${apiKey}`;
    
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
                
                var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                // Display current date
                let today = new Date();
                
                // var d = new Date(dateString);
                // var dayName = days[d.getDay()];
        
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                
                // Day name
                Date.prototype.getDayName = function() {
                    
                    var dayNumber = this.getDay();
                    return dayNames[ dayNumber ];
                }
                var dayName = today.getDayName();

                today = dayName + ', ' + mm + '/' + dd + '/' + yyyy;
                putTodaysDateHere.innerHTML = today;

                
                // Display current temperature for city
                putCurrentTempHere.innerHTML = Math.round(data.current.temp)+ '°';
                // Display current dew point for city
                putCurrentDewpointHere.innerHTML = data.current.dew_point + '°';
                // Icon is provided by API, given as a number/letter combo in API data.
                putIconHere.src= `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
                // Handles weather description
                putWeatherDescriptionHere.innerHTML = data.current.weather[0].description;
                // Wind speed (mph)
                putWindspeedHere.innerHTML = data.current.wind_speed + ' mph';
                // Feels Like
                putFeelsLikeHere.innerHTML = data.current.feels_like + '°';
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
                // Need to make daily forecast object constructor
                
                const createDailyHtml = (date, tempMin, tempMax, weather, icon) => 
                `
                <li class="flex flex-col items-center justify-evenly w-1/2 max-w-s mb-2" id="dayContainer">
                <div id="dateContainer">Date: ${date}</div>
                <div id="imgContainer">
                    <img id="icon" src=${icon} />
                </div>
                <div>Weather: ${weather}</div><br>
                <div>High: ${tempMax}°</div><br>
                <div>Low: ${tempMin}°</div>
                </li>
                `;
                console.log(today);

                class DailyForecast {
                    constructor() {
                        this.days = [];
                        this.date = today;
                        console.log(this.date);
                    }

                // Create a day object for each day in the forecast
                    addDays(){
                        for (let i =0 ; i < data.daily.length; i++){
                            // Display current date
                        let date = new Date();
                            // date.getDay();
                        // date.setDate(date.getDate() + 1);
                            
                            const day = {
                                // increment date and format it
                                date: date = mm + '/' + dd++ + '/' + yyyy,
                                tempMin: Math.round(data.daily[i].temp.min),
                                tempMax: Math.round(data.daily[i].temp.max),
                                weather: data.daily[i].weather[0].main,
                                icon: `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`
                                
                            };
                            
                        this.days.push(day);
                        // console.log(day);
                        }
                    };  

                // Display the day data    

                    render(){
                        const dailyForecastHtmlList = [];
                        for(let i = 0; i < this.days.length; i++){
                            const day = this.days[i];
                            const dayHtml = createDailyHtml(day.date, day.tempMin, day.tempMax, day.weather, day.icon);
                            dailyForecastHtmlList.push(dayHtml);
                        }
                    const daysHtml = dailyForecastHtmlList.join('\n');
                    const daysList = document.querySelector('#dailyForecastList');
                    daysList.innerHTML = daysHtml;

                    
                    }  
                }
                // Gonna try to get a 10 day forecast going
                


                const forecast = new DailyForecast();
                forecast.addDays();
                forecast.render();
            })
        }
        getCurrentData();

    })
    }
    getCoordinates();
}
cityForm.addEventListener('submit', handleSubmit);


// js for active alerts accordion component

/* Optional Javascript to close the radio button version by clicking it again */
var myRadios = document.getElementsByName('tabs2');
var setCheck;
var x = 0;
for(x = 0; x < myRadios.length; x++){
    myRadios[x].onclick = function(){
        if(setCheck != this){
             setCheck = this;
        }else{
            this.checked = false;
            setCheck = null;
    }
    };
}