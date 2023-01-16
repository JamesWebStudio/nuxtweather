<template>
  <div class="bg-blue-100 p-12 header">
    <h1 class="text-center text-blue-500 text-5xl font-serif">Nuxt Weather</h1>
  </div>
  <div class="locationBar">
    <img :src="mainWeatherImage" id="mainImage" v-if="!loading" class="fade-in">
    <h5 class="bar heartbeat" v-if="loading">Getting your local weather, please wait...</h5>
    <div class="locationText scale-in-ver-center" v-else>
      <h4>Your Weather in {{ myLocation }} is </h4>
      <h4>{{  localWeather.description }}</h4>
      <h4>Temperature {{ localWeather.temp }}&#8451;</h4>
      <h4>Humidity {{ localWeather.humidity }}%</h4>
      <h4>Wind {{ localWeather.windSpeed }}mph</h4>
      <h4 class="feels-like">Feels Like: {{ localWeather.feels_like }}&#8451;</h4>
    </div>
  </div>
  <div class="locationBar-small">
    <img :src="mainWeatherImage" id="mainImage">
    <div class="locationText scale-in-ver-center">
      <h4>Your Weather in {{ myLocation }} is </h4>
      <h4>{{  localWeather.description }}</h4>
      <h4>Temperature {{ localWeather.temp }}&#8451;</h4>
      <h4>Humidity {{ localWeather.humidity }}%</h4>
      <h4>Wind {{ localWeather.windSpeed }}mph</h4>
      <h4 class="feels-like">Feels Like: {{ localWeather.feels_like }}&#8451;</h4>
    </div>
  </div>
  <section class="forecast-section1" v-if="localForecast.length > 0">
    <h2 class="section-title">5 Day Forecast for {{ myLocation }}</h2>
    <section class="forecast">
      <div v-for="(day, index) in localForecast" :key="day.dt">
        <div class="card shadow-drop-center slide-in-right">
          <h2>Day {{ index + 1 }}</h2>
          <h2>{{ day.weather[0].description.toUpperCase() }}</h2>
          <h3>Temperature {{  day.main.temp }}&#8451;</h3>
          <h3>Wind Speed {{ day.wind.speed }}mph</h3>
          <h3>Humidity {{  day.main.humidity }}&#176;</h3>
          <div style="background-color: #DBEAFE; min-width: 300px; max-width:320px; margin: 20px auto;">
            <img :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`" width="128" height="128" alt="Weather Image">
          </div>
          <h3 style="color: red;">Feels Like {{ day.main.feels_like }}&#8451;</h3>
        </div>
      </div>
    </section>
  </section>
  <section class="weather-search">
    <h3>Search for weather for any city</h3>
    <form>
      <div>
        <label for="city">City</label>
        <input type="text" name="city" v-model="searchCity" class="search-input">
      </div>
      <div>
        <label for="codes">Country</label>
        <select id="codes" name="codes" v-model="selected">
          <option v-for="code in countryCodes" :value="code.name">
          {{ code.name }}, {{  code.code }}</option>
        </select>
      </div>
      <button @click.prevent="search" class="btn">Search</button>
      <p v-if="loadingGlobalWeather">Getting your weather for {{ savedSearchCity }}</p>
      <p style="color: red; margin-left:10px;" v-if="searchError">{{ searchError }}</p>
    </form>
  </section>
  <section class="searchedData scale-in-ver-center" v-if="savedSearchCity && !searchedLoading">
    <h3>The weather in {{ savedSearchCity }}, {{  selected.toUpperCase() }} is currently {{ searchedCityWeather.weather }}</h3>
    <h4>The Temperature is {{ searchedCityWeather.temp }}&#8451;</h4>
    <h4>Humidity is {{ searchedCityWeather.humidity }}%</h4>
    <h4>Wind speed is {{ searchedCityWeather.windSpeed }}mph</h4>
    <h4 class="feels-like">Feels Like: {{ searchedCityWeather.feels_like }}&#8451;</h4>
    <div class="icon-box text-center bg-blue-100 w-32 mx-auto">
      <img :src="`https://openweathermap.org/img/wn/${searchedCityWeather.icon}@4x.png`" width="128" height="128" alt="Weather Image" />
    </div>
    </section>
    <h2 class="section-title" v-if="globalForecast.length > 0">5 Day Forecast for {{ searchCity.toUpperCase() }}</h2>
  <section class="forecast-section2" v-if="globalForecast.length > 0">
    <div v-for="(day, index) in globalForecast" :key="day.dt" class="forecast">
      <div class="card shadow-drop-center slide-in-right">
        <h2>Day {{ index + 1 }}</h2>
        <h2>{{ day.weather[0].description.toUpperCase() }}</h2>
        <h3>Temperature {{  day.main.temp }}&#8451;</h3>
        <h3>Wind Speed {{ day.wind.speed }}mph</h3>
        <h3>Humidity {{  day.main.humidity }}&#176;</h3>
        <div style="background-color: #DBEAFE; width: 100vw; max-width:320px; margin: 20px 0;">
          <img :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`" width="128" height="128" alt="Weather Image">
        </div>
        <h3 style="color: red;">Feels Like {{ day.main.feels_like }}&#8451;</h3>
      </div>
    </div>
  </section>
  <footer>
    <div>
      <p>Weather data provided by OpenWeatherMap API</p>
    </div>
    <div>
      <p>&#169; jameswebstudio 2021</p>
      <p>website: https://www.jameswebstudio.uk</p>
      <p>email: jameswebstudio@outlook.com</p>
    </div>
  </footer>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import codes from './codes.js'

const API_KEY = '991119d56cc86bcda5fb55e6df736d01'
const countryCodes = codes
let lat = ref(null)
let lng = ref(null)
let myLocation = ref('')
let loadingGlobalWeather = ref(false)
let localWeather = ref({
  description: '',
  temp: 0,
  windSpeed: 0,
  icon: '',
  feels_like: '',
  humidity: 0
})
let searchedCityWeather = ref({
  temp: 0,
  weather: '',
  windSpeed: 0,
  icon: '',
  feels_like: '',
  humidity: 0,
  lng: 0,
  lat: 0
})
let loading = ref(true)
let searchedLoading = ref(false)
let searchCity = ref('')
let localForecast = ref([])
let globalForecast = ref([])
let savedSearchCity = ref('')
let imgElement = ref(null)
let mainWeatherImage = ref('')
let selected = ref('UK')
let searchError = ref('')

// success method for Navigator call
async function success(position) {
  lat.value = position.coords.latitude
  lng.value = position.coords.longitude
  
   fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat.value}&longitude=${lng.value}&localityLanguage=en`)
    .then(res => res.json())
    .then(data => {
      myLocation.value = data.city
    })
    .catch(err => {
      myLocation.value = "Error, failed to load local weather"
    })

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lng.value}&appid=${API_KEY}&units=metric`)
  .then(res => res.json())
  .then(data => {
    localWeather.value.description = data.weather[0].description
    localWeather.value.temp = data.main.temp
    localWeather.value.windSpeed = data.wind.speed
    localWeather.value.icon = data.weather[0].icon
    localWeather.value.feels_like = data.main.feels_like
    localWeather.value.humidity = data.main.humidity
    mainWeatherImage.value = data.weather[0].description
    
    switch (data.weather[0].description) {
      case 'clear sky': {
        mainWeatherImage.value = `/weatherImages/clearsky.webp`
        break;
      }
      case 'few clouds': {
        mainWeatherImage.value = '/weatherImages/fewclouds.webp'
        break;
      }
      case 'scattered clouds': {
        mainWeatherImage.value = '/weatherImages/scatteredClouds.avif'
        break;
      }
      case 'broken clouds': {
        mainWeatherImage.value = '/weatherImages/brokenclouds.jpg'
        break;
      }
      case 'light rain': {
        mainWeatherImage.value = '/weatherImages/light-rain.png'
        break;
      }
      case 'rain': {
        mainWeatherImage.value = '/weatherImages/heavyrain.jpg'
        break;
      }
      case 'thunderstorm': {
        mainWeatherImage.value = '/weatherImages/heavyrain.jpg'
        break;
      }
      case 'snow': {
        mainWeatherImage.value = '/weatherImages/snowheavy.jpg'
        break;
      }
      case 'mist': {
        mainWeatherImage.value = '/weatherImages/mist.jpg'
      }
      case 'light intensity drizzle': { /
        mainWeatherImage.value = '/weatherImages/light-rain.png'
      }
      default: {
        mainWeatherImage.value = '/weatherImages/multiple-weather.webp'
      }
    }
    loading.value = false
    FiveDayForecast('local')
  })
}

// Error function for Navigator call
function error() {
  myLocation.value = "Failed to get your location"
}

onMounted(() => {
  if(window.navigator) {
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true
    })
  }
  imgElement = document.getElementsByClassName('locationBar')[0]
  imgElement.style.backgroundImage = mainWeatherImage
})

// Search method to get weather for selected location
function search() {
  searchError.value = ''
  if(searchCity.value === '' || selected.value === '') { 
    searchError.value = "City and Country required"
    return 
  } 
  searchedLoading.value = true
  savedSearchCity.value = searchCity.value.toUpperCase()
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${savedSearchCity.value},${selected.value}&appid=${API_KEY}&units=metric`)
  .then(res => res.json())
  .then(searchData => {
    searchedCityWeather.value.weather = searchData.weather[0].description
    searchedCityWeather.value.temp = searchData.main.temp
    searchedCityWeather.value.windSpeed = searchData.wind.speed
    searchedCityWeather.value.windDirection = searchData.wind.deg
    searchedCityWeather.value.icon = searchData.weather[0].icon
    searchedCityWeather.value.feels_like = searchData.main.feels_like
    searchedCityWeather.value.humidity = searchData.main.humidity
    searchedCityWeather.value.lat = searchData.coord.lat
    searchedCityWeather.value.lng = searchData.coord.lon
    searchedLoading.value = false
    FiveDayForecast('global') 
 })
 .catch(err => {
  searchError.value = 'No result found. Please check city & country'
  searchedLoading.value = false
 })
}

// Get the 5 day forecast for local city or searched city
function FiveDayForecast(location) {
  if(location === 'local') {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat.value}&lon=${lng.value}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      localForecast.value = data.list.slice(1, 6)
      selected.value = ''
      savedSearchCity.value = ''
    })
    .catch(err => {
      console.log(err.message)
    })
  }
  else {
    // loadingGlobalWeather.value = true
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchedCityWeather.value.lat}&lon=${searchedCityWeather.value.lng}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      globalForecast.value = data.list.slice(1, 6)
      // loadingGlobalWeather.value = false
    })
    .catch(err => {
      console.log(err.message)
    })
  }
}
</script>

<style scoped>
:root {
  --backgroundColor: #DBEAFE;
}

* {
  margin:0;
  padding:0;
}
.header {
  height:80px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box {
  width:150px;
  height:150px;
  margin: 20px auto;
}
.locationBar {
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom:20px;
  display:none;
  flex-direction: column;
  align-items:center;
}

.locationBar, .searchedData, .bar {
  text-align:center;
  font-size: 1.5rem;
}

.locationBar-small {
  display:flex;
  flex-wrap: wrap;
  height: 100%;
  padding:10px;
}

.locationBar-small .locationText {
  margin: 20px auto;
  text-align:center;
  font-size: clamp(1.2rem, 1.5rem, 1.5rem);
  font-weight: 600;
}

#mainImage {
  width: 100%;
  height: 100%;
  position:relative;
}

.weather-search {
  background-color: #DBEAFE;
  display:flex;
  flex-wrap: wrap;
  margin: 2rem auto;
  padding:10px;
  width: 100vw;
  max-width: 500px;
}

.weather-search h3 {
  font-size: 1.3rem;
  text-align: center;
  display:flex;
  justify-content: center;
  margin-bottom:20px;
  width: 100%;
}

.search-input {
  border: none;
  border-bottom: 2px solid rgb(169, 188, 231);
  min-width: 100%;
  height:40px;
  text-transform: uppercase;
  padding: 0 10px;
}

form {
  max-width:100vw;
  display:flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  text-align:center;
}

form > div {
  width: 90%;
  padding:0;
  margin:0;
  margin-bottom: 20px;
  display:flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: baseline;
}

form > label {
  width: 90%;
  margin-bottom: 10px;
}

form select {
  height:40px;
  padding: 0 10px;
  max-width: 95vw;
}

.search-input:hover {
  border: none;
}

.btn:hover {
  background-color: rgb(169, 188, 231);
  color: red;
}

.btn {
  border:2px solid rgb(169, 188, 231);
  padding: 2px 5px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.4rem;
  height:50px;
}

.searchedData {
  display:flex;
  flex-direction:column;
  margin: 20px auto;
  width: 1005;
}

.feels-like {
  color: red;
}

.forecast-section1 {
  width: 100vw;
  display:flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.forecast-section2 {
  width: 100vw;
  display:flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.section-title {
  font-size: clamp(1.2rem, 1.4rem, 1.6rem);
  margin: 30px auto 10px auto;
  text-align:center;
}

.forecast {
  display:flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  flex-direction:row !important;
}

.card {
  padding:10px;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10px auto;
}

.card h2 {
  font-size: 1.2rem;
}

.card h3 {
  font-size: 1rem;
}

footer {
  max-width: 100vw;
  display:flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: #DBEAFE;
  color: black;
  padding:30px;
  position: sticky;
  top: calc(100vh - 60px);
  left: 0;
  text-align: center;
}

img {
  margin:0 auto;
}
footer div:first-child {
  margin-bottom:15px;
}

.shadow-drop-center {
  -webkit-animation: shadow-drop-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.640) both;
          animation: shadow-drop-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.640) both;
}

/**
 * ----------------------------------------
 * animation shadow-drop-center
 * ----------------------------------------
 */
@-webkit-keyframes shadow-drop-center {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  100% {
    -webkit-box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
            box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
  }
}
@keyframes shadow-drop-center {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  100% {
    -webkit-box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
            box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
  }
}

.scale-in-ver-center {
	-webkit-animation: scale-in-ver-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: scale-in-ver-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

/**
 * ----------------------------------------
 * animation scale-in-ver-center
 * ----------------------------------------
 */
 @-webkit-keyframes scale-in-ver-center {
  0% {
    -webkit-transform: scaleY(0);
            transform: scaleY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1);
    opacity: 1;
  }
}
@keyframes scale-in-ver-center {
  0% {
    -webkit-transform: scaleY(0);
            transform: scaleY(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1);
    opacity: 1;
  }
}

.fade-in {
	-webkit-animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	        animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

/**
 * ----------------------------------------
 * animation fade-in
 * ----------------------------------------
 */
@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.slide-in-right {
	-webkit-animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.slide-in-right-day2 {
	-webkit-animation: slide-in-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.slide-in-right-day3 {
	-webkit-animation: slide-in-right 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-right 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.slide-in-right-day4 {
	-webkit-animation: slide-in-right 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-right 1.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.slide-in-right-day5 {
	-webkit-animation: slide-in-right 1.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-right 1.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
/**
 * ----------------------------------------
 * animation slide-in-right
 * ----------------------------------------
 */
@-webkit-keyframes slide-in-right {
  0% {
    -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-right {
  0% {
    -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}

.heartbeat {
	-webkit-animation: heartbeat 1.5s ease-in-out infinite both;
	        animation: heartbeat 1.5s ease-in-out infinite both;
}

/**
 * ----------------------------------------
 * animation heartbeat
 * ----------------------------------------
 */
 @-webkit-keyframes heartbeat {
  from {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-transform-origin: center center;
            transform-origin: center center;
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  10% {
    -webkit-transform: scale(0.91);
            transform: scale(0.91);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  17% {
    -webkit-transform: scale(0.98);
            transform: scale(0.98);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  33% {
    -webkit-transform: scale(0.87);
            transform: scale(0.87);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  45% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
}
@keyframes heartbeat {
  from {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-transform-origin: center center;
            transform-origin: center center;
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  10% {
    -webkit-transform: scale(0.91);
            transform: scale(0.91);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  17% {
    -webkit-transform: scale(0.98);
            transform: scale(0.98);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  33% {
    -webkit-transform: scale(0.87);
            transform: scale(0.87);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  45% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
}



@media screen and (min-width: 768px) {
  .locationBar {
    height: 500px;
    color: rgb(73, 73, 72);
    font-weight: 800;
    letter-spacing:3px;
    line-height:40px;
    display: flex;
  }

  .locationBar-small {
    display:none;
  }

  .locationText {
    position: absolute;
    top: 100px;
    transform: translateX(50%);
    background: rgba(0,0,0, 0.5);
    padding:30px;
    color: white;
    font-weight: 800;
    letter-spacing:3px;
    line-height:40px;
  }

  .card h2 {
    font-size: 1.4rem;
  }
  .card h3 {
    font-size: 1.2em;
  }

  footer div {
    padding: 0 2rem;
    justify-content: space-evenly;
    align-items: baseline;
  }
}
</style>

