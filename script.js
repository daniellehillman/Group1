$(".dropdown-trigger").dropdown();
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

// find current position
function geoFindMe() {

  event.preventDefault()
  const status = document.querySelector('#status')
  const mapLink = document.querySelector('#map-link')

  mapLink.href = ''
  mapLink.textContent = ''

  // if position found
  function success(position) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude

    status.textContent = ''
    // call to openstreetmap
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`

    // request ip position
    axios.get('https://ipinfo.io')
      .then(res => {

        // get city name from ip position, update text input
        document.getElementById('city').value = res.data.city
        document.getElementById('city').textContent = res.data.city

        // update city text input field
        M.updateTextFields()
      })
      .catch(err => {
        console.log(err)
      })

  }

  // if position not found, manual input instead
  function error() {
    status.textContent = 'Unable to retrieve your location. Please enter a city instead.'
  }

  // check if geolocation is supported in browser
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser'
  } else {
    status.textContent = 'Locating…'
    navigator.geolocation.getCurrentPosition(success, error)
  }
}

// check if a mood is selected
function moodSelected() {
  let count = 0
  $('.mood').each(function () {
    if ($(this).hasClass('active')) {
      count++
    }
  })
  return count >= 1
}

// get weather using API and call subsequent API's
function getWeatherData(username, usercity, usermood) {
  document.getElementById('name').value = ''
  document.getElementById('city').value = ''
  $('.mood').each(function () {
    if ($(this).prop('checked', true)) {
      $(this).prop('checked', false)
    }
  })

  // set currentCity to user's current city
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
      document.getElementById('forecast').style.display = 'inline-block'
      let cond = res.data.weather[0].main
      let weather = document.getElementById('weather')

      let forecast = document.getElementById('forecast')

      // reset forecast element for dynamic update
      forecast.innerHTML = ''

      let cardElem = document.createElement('div')
      cardElem.className = 'card-image'
      cardElem.id = 'cardElem'

      // new variables
      let danceability
      let energy

      let iconElem = document.createElement('i')
      // loop through conditions array 
      for (let i = 0; i < conditions.length; i++) {
        // check for a condition with a matching description
        if (conditions[i].cond === cond) {

          // get corresponding icon from array to render onto page
          iconElem.className = `wi ${conditions[i].icon}`
          iconElem.id = 'weatherIcons'

          // assign danceability and energy
          danceability = conditions[i].danceability
          energy = conditions[i].energy
        }
      }
      cardElem.append(iconElem)
      forecast.append(cardElem)

      // weather card content
      let weatherElem = document.createElement('div')
      weatherElem.className = 'card-content'
      weatherElem.id = 'weatherDesc'
      weatherElem.innerHTML = `
        <p class="weatherTextStyle">Your current weather forecast: ${res.data.weather[0].main}</p>
        <p class="weatherTextStyle">Your current temperature: ${res.data.main.temp} \xB0F</p> 
      `
      forecast.append(weatherElem)

      // call to SpotifyAPI using danceability, energy, and genre parameters
      axios.get(`https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_genres=${genre}&target_danceability=${danceability}&target_energy=${energy}`, {
        headers: {
          'Authorization': `Bearer BQBoiAkj-G7F_HtCBAteh3H3Y22ctqfg-yXcQLEa7WpFhpdsqcRAHcxSMCQmWamk-6ztKPo5aHlBEwWKPszQrztBHfOUR-SB8gQc4uo356pXOniuAjuDD5qYUJBEVtJWkC3qjuBbf_EBjUDo67XlgjMP`
        }
      })
        .then(res => {

          // get all playlist tracks from API call
          let tracks = res.data.tracks
         
          let playlist = document.getElementById('playlist')
          let allImages = []
          for (let i = 0; i < tracks.length; i++) {
            // find album cover in tracks objects
            image = tracks[i].album.images[0].url || "https://player.tritondigital.com/tpl/default/html5/img/player/default_cover_art.jpg"
            allImages.push(image)

            // reset lyrics and song title elements in modal
            document.getElementById(`song${i + 1}`).textContent = ''
            document.getElementById(`lyrics${i + 1}`).innerHTML = ''

            // get lyrics from lyrics API
            axios.get(`https://api.lyrics.ovh/v1/${tracks[i].artists[0].name}/${tracks[i].name}`)
              .then(res => {

                let lyrics = res.data.lyrics

                // replace any carriage return or newline character with a <br> tag to render html appropriately
                lyrics = lyrics.replace(/(?:\r\n|\r|\n)/g, '<br>')

                document.getElementById(`song${i + 1}`).textContent = `${tracks[i].artists[0].name} – ${tracks[i].name}`
                document.getElementById(`lyrics${i + 1}`).innerHTML = lyrics
              })
              .catch(err => {
                // no lyrics found, console.log() the error and display appropriate message
                console.log(err)
                document.getElementById(`song${i + 1}`).textContent = `${tracks[i].name}`
                document.getElementById(`lyrics${i + 1}`).innerHTML = `
                  Sorry, no lyrics available.
                `
              })
          }

          let carousel = document.createElement('div')
          carousel.className = 'carousel'

          // reset carousel display
          playlist.innerHTML = ''

          // display name to user
          playlist.innerHTML = `
          <h2 class="center-align">Here's your playlist ${username}</h2>
          `

          // create carousel of songs with album cover
          for (let i = 0; i < allImages.length; i++) {
            let carouselElem = document.createElement('a')
            carouselElem.className = 'carousel-item'
            carouselElem.href = `#${i}!`

            let imgElem = document.createElement('img')
            imgElem.src = `${allImages[i]}`

            let divElem = document.createElement('div')

            divElem.className = "btnFix"
          
            // lyrics modal button and open in spotify button
            divElem.innerHTML = `
            <a id="lyricsBtn" class="btn-small waves-effect allBtns modal-trigger" href="#lyricsModal${i + 1}">See Lyrics</a>
            <a class="btn-small waves-effect allBtns" href="https://open.spotify.com/track/${tracks[i].id}" target="_blank">Open</a>
            `
            carouselElem.append(imgElem)
            carouselElem.append(divElem)
            carousel.append(carouselElem)
          }

          // render carousel onto page
          playlist.append(carousel)
          $('.carousel').carousel();
        })
        .catch(err => {
          console.error(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
}

// initiate all modal elements to be ready for use
document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.modal')
  let instances = M.Modal.init(elems)
})

// location button event listener
document.getElementById('find-me').addEventListener('click', function () {
  event.preventDefault()
  geoFindMe()
})

// mood radio buttons event listener
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

    // clear inputs
    name.value = ''
    city.value = ''
    $(".mood").each(function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active")
      }
    })
  }
})
