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
    axios.get('http://ipinfo.io')
      .then(res => {
        // console.log(res.data.city)

        // get city name from ip position, update text input
        document.getElementById('city').value = res.data.city
        document.getElementById('city').textContent = res.data.city
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

function getWeatherData(username, usercity, usermood) {

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
      let weather = document.getElementById('weather')
      
      let forecast = document.getElementById('forecast')
      
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

          iconElem.className = `wi ${conditions[i].icon}`
          iconElem.id = 'weatherIcons'
          
          // assign danceability and energy
          danceability = conditions[i].danceability
          energy = conditions[i].energy
        }
      }
      cardElem.append(iconElem)
      forecast.append(cardElem)

      let weatherElem = document.createElement('div')
      weatherElem.className = 'card-content'
      weatherElem.id = 'weatherDesc'
      weatherElem.innerHTML = `
        <p>Your current weather forecast: ${res.data.weather[0].main}</p>
        <p>Your current temperature: ${res.data.main.temp} \xB0F</p> 
      `
      forecast.append(weatherElem)

      // call to SpotifyAPI using danceability, energy, and genre parameters
      axios.get(`https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_genres=${genre}&target_danceability=${danceability}&target_energy=${energy}`, {
        headers: {
          'Authorization': `Bearer BQCjjJ8Iz8lzPKbIkPNwAJ3LQ3i6M3WH5TOEm0KeWWo9fbKn7IMQmSTn0UsjGWqaDRoPnYTOQfLBiZvg9PHw_W8ps9JzyNMgcNg8FB7nXyl0a_Zirnr-W2uVBQ3nRsz8pxW6rnCtEVfNaNAtZHqw7TXA`
        }
      })
        .then(res => {
          let tracks = res.data.tracks
            
          let playlist = document.getElementById('playlist')
          let allImages = []
          for (let i = 0; i < tracks.length; i++) {
            image = tracks[i].album.images[0].url || "https://player.tritondigital.com/tpl/default/html5/img/player/default_cover_art.jpg"
            allImages.push(image)

            document.getElementById(`song${i+1}`).textContent = ''
            document.getElementById(`lyrics${i+1}`).innerHTML = ''
            axios.get(`https://api.lyrics.ovh/v1/${tracks[i].artists[0].name}/${tracks[i].name}`)
              .then(res => {

                let lyrics = res.data.lyrics
                lyrics = lyrics.replace(/(?:\r\n|\r|\n)/g, '<br>')

                document.getElementById(`song${i+1}`).textContent = `${tracks[i].name}`
                document.getElementById(`lyrics${i+1}`).innerHTML = lyrics
              })
              .catch(err => {
                console.log(err, 'not working')
                document.getElementById(`song${i+1}`).textContent = `${tracks[i].name}`
                document.getElementById(`lyrics${i+1}`).innerHTML = `
                  Sorry, no lyrics available.
                `
              })
          }

          let carousel = document.createElement('div')
          carousel.className = 'carousel'

          playlist.innerHTML = ''
          playlist.innerHTML = `
          <h2 class="center-align">Here's your playlist ${username}</h2>
          `

          for (let i = 0; i < allImages.length; i++) {
            let carouselElem = document.createElement('a')
            carouselElem.className = 'carousel-item'
            carouselElem.href = `#${i}!`

            let imgElem = document.createElement('img')
            imgElem.src = `${allImages[i]}`

            let divElem = document.createElement('div')
          
            divElem.innerHTML = `
            <a class="btn-small waves-effect allBtns modal-trigger" href="#lyricsModal${i+1}">See Lyrics</a>
            `
            carouselElem.append(imgElem)
            carouselElem.append(divElem)
            carousel.append(carouselElem)
          }

          playlist.append(carousel)


          // for (let i = 0; i < tracks.length; i++) {
          //   axios.get(`https://api.lyrics.ovh/v1/${tracks[i].artists[0].name}/${tracks[i].name}`)
          //     .then(res => {
          //       console.log(res.data.lyrics)
          //       let lyrics = res.data.lyrics
          //       lyrics = lyrics.replace('\n', '<br>')
          //       let playlist = document.getElementById('playlist')
          //       // playlist.innerHTML = ''

          //       document.getElementById(`${i}`).innerHTML = `
          //         <a class="carousel-item" href="#two!"><img src="${tracks[i].album.images[0].url}"> <div id="0">0</div></a>
          //         <p>Artist: ${tracks[i].artists[0].name} Song Title: ${tracks[i].name}</p>
          //         <p>${lyrics}</p>
          //       `
          //       $('.carousel').carousel();
          //     })

          //     .catch(err => {
          //       // console.error(err)
          //       document.getElementById(`${i}`).innerHTML = `
          //       <a class="carousel-item" href="#two!"><img src="${tracks[i].album.images[0].url}"> <div id="0">0</div></a>
          //       <p>Artist: ${tracks[i].artists[0].name} Song Title: ${tracks[i].name}. 
          //       There is no lyrics for the song</p>
          //       `
          //       $('.carousel').carousel();
          //     })
          //}

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

document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.modal')
  let instances = M.Modal.init(elems)
})

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
