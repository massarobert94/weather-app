const button = document.getElementById('btn');
const putDescriptionHere = document.getElementById('description');
const putCurrentTempHere = document.getElementById('temp');
const putCurrentDewpointHere = document.getElementById('dewpoint');


    const cityValue = 'Miami, FL';

    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cityValue}&key=AIzaSyAAKTI9WyKzFDxKZDomHIrSaVP22BgzRY0`;

    // Get Latitude and Longitude coordinates from given city

    const sendCity = async (method, url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
    }

    const getCoordinates = async () => {
    sendCity('GET', geoUrl)
    .then(res => {

        const { results } = res;
        console.log(results);
        console.log(results[0].geometry.location.lat);
        const latitude = results[0].geometry.location.lat;
        console.log(results[0].geometry.location.lng);
        const longitude = results[0].geometry.location.lng;
    
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly&appid=c680d0ec673f56da94ef0342e8a5212a`;
        
    // Get weather data for the given coordinates, send it to HTML
        const sendRequest = async (method, url) => {
            let response = await fetch(url);
            let data = await response.json();
            console.log(data);
            return data;
        }
        const getData = async () => {
            sendRequest('GET', url)
            .then(data => {
                console.log(data);
                putCurrentTempHere.innerHTML = data.current.temp;
                putCurrentDewpointHere.innerHTML = data.current.dew_point;
            })
        }
        
        getData();
    
    })
    }

button.addEventListener('click', getCoordinates());
// const latitude = 33.44;
// const longitude = -94.04;

