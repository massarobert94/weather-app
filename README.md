# weather-app
City is given, which is sent to an API returning lat &amp; lng coordinates, which are then sent to a weather API returning weather data for those coordinates.


You'll need to get an API key for Google Maps API and for Open Weather API.
- Create a file called "config.js".
- Create an object called config like so:

var config = {
      GEO_KEY: 'YOUR GOOGLE MAPS API KEY HERE',
      WEATHER_KEY: 'YOUR OPEN WEATHER API KEY HERE'
}
