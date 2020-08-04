// conditions array of objects
// each object has a weather condition, a danceability number, and energy number
let conditions = [
  {
    cond: 'Thunderstorm',
    danceability: 0.0,
    energy: 0.8,
    icon: 'wi-thunderstorm'
  }, 
  {
    cond: 'Drizzle',
    danceability: 0.1,
    energy: 0.4,
    icon: "wi-sprinkle"
  },
  {
    cond: 'Rain',
    danceability: 0.1,
    energy: 0.5,
    icon: 'wi-rain'
  }, 
  {
    cond: 'Snow',
    danceability: 0.2,
    energy: 0.2,
    icon: 'wi-snowflake-cold'
  }, 
  {
    cond: 'Clear',
    danceability: 1.0,
    energy: 1.0,
    icon: 'wi-night-clear'
  }, 
  {
    cond: 'Clouds',
    danceability: 0.4,
    energy: 0.3,
    icon: 'wi-cloudy'
  }, 
  { 
    cond: 'Mist',
    danceability: 0.3,
    energy: 0.2,
    icon: 'wi-snow-wind'
  }, 
  { 
    cond: 'Smoke',
    danceability: 0.0,
    energy: 0.6,
    icon: 'wi-smoke'
  }, 
  {
    cond: 'Haze',
    danceability: 0.4,
    energy: 0.3,
    icon: 'day-haze'
  }, 
  {
    cond: 'Dust',
    danceability: 0.4,
    energy: 0.3,
    icon: 'wi-dust'
  },
  {
    cond: 'Fog',
    danceability: 0.3,
    energy: 0.3,
    icon: 'wi-fog'
  }, 
  {
    cond: 'Sand',
    danceability: 0.8,
    energy: 0.6,
    icon: 'wi-sandstorm'
  }, 
  {
    cond: 'Ash',
    danceability: 0.1,
    energy: 0.2,
    icon: 'volcano'
  }, 
  {
    cond: 'Squall',
    danceability: 0.0,
    energy: 0.8,
    icon: 'wi-strong-wind'
  }, 
  {
    cond: 'Tornado',
    danceability: 0.0,
    energy: 1.0,
    icon: 'wi-tornado'
  }
]

// array of moods
let moods = ['happy', 'stressed', 'chill', 'depressed', 'hyped']

// global variables
let mood
let userLat
let userLon
let token = ''

function geoFindMe () {
  event.preventDefault()

  const status = document.querySelector('#status')
  const mapLink = document.querySelector('#map-link')
  
  mapLink.href = ''
  mapLink.textContent = ''
  
  function success(position) {
    const latitude  = position.coords.latitude
    const longitude = position.coords.longitude
    userLat = latitude
    userLon = longitude
  
    status.textContent = ''
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    // console.log(`Latitude: ${latitude} °, Longitude: ${longitude} °`)
    axios.get('http://ipinfo.io')
      .then(res => {
        // console.log(res.data.city)
        document.getElementById('city').value = res.data.city
        document.getElementById('city').textContent = res.data.city
        M.updateTextFields()
      })
      .catch(err => {
        console.log(err)
      })

  }
  
  function error() {
    status.textContent = 'Unable to retrieve your location. Please enter a city instead.'
  }
  
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser'
  } else {
    status.textContent = 'Locating…'
    navigator.geolocation.getCurrentPosition(success, error)
  }
  
}

function moodSelected () {
  let count = 0
  $('.mood').each(function () {
    if ($(this).hasClass('active')) {
      count++
    }
  })

  return count >= 1
}

function getWeatherData (username, usercity, usermood) {

  let weather = document.getElementById('weather')
  let currentCity = document.getElementById('currentCity')
  currentCity.textContent = usercity

  let genre = ''

  // determine genre based on mood
  switch (moods[usermood]) {
    case 'happy':
      genre = 'pop'
    break
    case 'chill':
      genre = 'chill'
    break
    case 'depressed':
      genre = 'r-n-b'
    break
    case 'hyped':
      genre = 'edm'
    break
    case 'stressed':
      genre = 'jazz'
    break
  }

  // call to OpenWeatherAPI using city
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${usercity}&units=imperial&appid=b46e0399b18e0132c4c34e7071caa187`)
    .then(res => {
      // check the weather condition from the result
      let cond = res.data.weather[0].main

      let weatherElem = document.createElement('div')
      weatherElem.innerHTML = `
      <p id="weatherDesc">${res.data.weather[0].description}</p>
       <i class="wi wi-day-sunny"></i>
      `
      weather.append(weatherElem)

      // new variables
      let danceability
      let energy 

      // loop through conditions array 
      for (let i = 0; i < conditions.length; i++) {
        // check for a condition with a matching description
        if (conditions[i].cond === cond) {

          let iconElem = document.createElement('i')
          iconElem.className = `${conditions[i].icon}`
          weather.append(iconElem)

          // assign danceability and energy
          danceability = conditions[i].danceability
          energy = conditions[i].energy
        }
      }

      // call to SpotifyAPI using danceability, energy, and genre parameters
      axios.get(`https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_genres=${genre}&target_danceability=${danceability}&target_energy=${energy}`, {
        headers: {
          'Authorization': `Bearer BQA9Exia83RoYInnO26V402iwVG6lU8pvYBZ8F5Ac9LEhKMtSYlCwiiGuPv5vgthvoa4LNwYIjWvfbbZuIKfOaJbCtwTD1Gv-LWLfuJqMFRr4qmzGN2NfQCNHklYSiDwto5TNyKYE82huRdU09O1uk0P`
        }})
        .then(res => {
          console.log(res)
          let tracks = res.data.tracks

          // display all tracks with artists, album names, and song titles
          for (let i = 0; i < tracks.length; i++) {
            console.log(`Artist: ${tracks[i].artists[0].name}, Album: ${tracks[i].album.name}, Song Title: ${tracks[i].name}`)
          }

          let playlist = document.getElementById('playlist')
          playlist.innerHTML = ''

          playlist.innerHTML = `
            <button>View Playlist</button>
          `
        })
        .catch(err => {
          console.error(err)
          // axios.post({
          //   url: 'https://accounts.spotify.com/api/token',
          //   form: {
          //     grant_type: 'refresh_token',
          //     refresh_token: 'AQAftF4aMobHTr8Hzmap5Hbb2cGA8OFcGJAa0U6MTG_IxggQsNQ6KGrAL919X3fxNbBpTTh5KCFUEy6MVM0Oo1MlQJr9y2aLHssvAioycRIZldC_QxNP5-YmCukc6Or-_lI'
          //   },
          //   headers: {
          //     'Authorization': 'Basic NWIxNWE5YTMyOGRmNGE4ZDk4MDkxNmE0M2RmOWRhYzg6OTc5MWJlOTgzODJmNDhhOGIwZDI5Njg0ZGJiODVkZTI='
          //   }
          // })
          //   .then(res => {
          //     console.log(rs.data)
          //   })
          //   .catch(err => {
          //     console.log(err)
          //   })
        })
    })
    .catch(err => {
      console.log(err)
    })

}
  
document.querySelector('#find-me').addEventListener('click', function () {
  event.preventDefault()
  geoFindMe()
})

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('mood')) {
    event.target.classList.add('active')
    mood = event.target.value
  }
})

// submit form event listener
document.getElementById('submitBtn').addEventListener('click', function () {
  event.preventDefault()

  let name = document.getElementById('name')
  let city = document.getElementById('city')

  if (name.value === '' ||
      city.value === '' ||
      !moodSelected()) {
    let required = document.getElementById('requireAll')
    required.innerHTML = `Please fill in all inputs.`
  } else {
    getWeatherData(name.value, city.value, mood)
  }
})
