
var instance = M.Carousel.init({
  fullWidth: true,
  indicators: true
})




// document.getElementById('submit').addEventListener('click', event => {
//   event.preventDefault()

//   let city = document.getElementById('city').value

//   axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
//     .then(res => {
//       console.log(res.data)
//       document.getElementById('test').innerHTML = `
//       <h1>${res.data.name}</h1>
//       <h2>Weather: ${res.data.weather[0].description}</h2>
//       <h3>Temperature: ${res.data.main.temp}</h3>

//     `
//     })

//     .catch(err => { console.log(err) })

// })


// conditions array of objects
// each object has a weather condition, a danceability number, and energy number
let conditions = [
  {
    cond: 'Thunderstorm',
    danceability: 0.0,
    energy: 0.8
  },
  {
    cond: 'Drizzle',
    danceability: 0.1,
    energy: 0.4
  },
  {
    cond: 'Rain',
    danceability: 0.1,
    energy: 0.5
  },
  {
    cond: 'Snow',
    danceability: 0.2,
    energy: 0.2
  },
  {
    cond: 'Clear',
    danceability: 1.0,
    energy: 1.0
  },
  {
    cond: 'Clouds',
    danceability: 0.4,
    energy: 0.3
  },
  {
    cond: 'Mist',
    danceability: 0.3,
    energy: 0.2
  },
  {
    cond: 'Smoke',
    danceability: 0.0,
    energy: 0.6
  },
  {
    cond: 'Haze',
    danceability: 0.4,
    energy: 0.3
  },
  {
    cond: 'Dust',
    danceability: 0.4,
    energy: 0.3
  },
  {
    cond: 'Fog',
    danceability: 0.3,
    energy: 0.3
  },
  {
    cond: 'Sand',
    danceability: 0.8,
    energy: 0.6
  },
  {
    cond: 'Ash',
    danceability: 0.1,
    energy: 0.2
  },
  {
    cond: 'Squall',
    danceability: 0.0,
    energy: 0.8
  },
  {
    cond: 'Tornado',
    danceability: 0.0,
    energy: 1.0
  }
]

// array of moods
let moods = ['happy', 'stressed', 'chill', 'depressed', 'hyped']

// global variables
let mood
let userLat
let userLon
let token = ''

function geoFindMe() {

  const status = document.querySelector('#status')
  // <<<<<<< HEAD
  const mapLink = document.querySelector('#map-link')

  mapLink.href = ''
  mapLink.textContent = ''

  // =======
  //   const mapLink = document.querySelector('#map-link')
  //   mapLink.href = ''
  //   mapLink.textContent = ''

  // >>>>>>> b43c73781cf1365739ac12dfe27106141970eeb6
  function success(position) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    userLat = latitude
    userLon = longitude

    status.textContent = ''
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    console.log(`Latitude: ${latitude} °, Longitude: ${longitude} °`)

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
      `
      weather.append(weatherElem)

      // new variables
      let danceability
      let energy

      // loop through conditions array 
      for (let i = 0; i < conditions.length; i++) {
        // check for a condition with a matching description
        if (conditions[i].cond === cond) {

          // assign danceability and energy
          danceability = conditions[i].danceability
          energy = conditions[i].energy
        }
      }

      // call to SpotifyAPI using danceability, energy, and genre parameters
      axios.get(`https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_genres=${genre}&target_danceability=${danceability}&target_energy=${energy}`, {
        headers: {
          'Authorization': `Bearer BQB2vki_U_9F1CneBrA-8e0KbgAxPXzYEmPWCQ9Q5K1dNIlJ7p52x85pNhPHFjTl7eGwB04ff7Zgtrre4BlAQ1iWQhkBDfCRnrQVWmPqg9Dc7Ns9p-1DdcXaSco1dWquG3w9l6R4Vvzl9UVmQ_iq7mHN`
          // <<<<<<< HEAD
        }
      })
        // =======
        //         }})
        // >>>>>>> b43c73781cf1365739ac12dfe27106141970eeb6
        .then(res => {
          let tracks = res.data.tracks

          // display all tracks with artists, album names, and song titles
          let playlist = document.getElementById('playlist')
          playlist.innerHTML = `
                  <button>View Playlist</button>
                  <div id="1"></div>
                  <div id="2"></div>
                  <div id="3"></div>
                  <div id="4"></div>
                  <div id="5"></div>
                  <div id="6"></div>
                  <div id="7"></div>
                  <div id="8"></div>
                  <div id="9"></div>
                  <div id="10"></div>
                `
          for (let i = 0; i < tracks.length; i++) {
            console.log(`Artist: ${tracks[i].artists[0].name}, Album: ${tracks[i].album.name}, Song Title: ${tracks[i].name}`)

            // <<<<<<< HEAD

            axios.get(`https://api.lyrics.ovh/v1/${tracks[i].artists[0].name}/${tracks[i].name}`)
              .then(res => {
                console.log(res.data.lyrics)
                let lyrics = res.data.lyrics
                lyrics = lyrics.replace('\n', '<br>')
                let playlist = document.getElementById('playlist')
                // playlist.innerHTML = ''

                document.getElementById(`${i}`).innerHTML = `
                  <a class="carousel-item" href="#two!"><img src="${tracks[i].album.images[0].url}"> <div id="0">0</div></a>
                  <p>Artist: ${tracks[i].artists[0].name} Song Title: ${tracks[i].name}</p>
                  <p>${lyrics}</p>
                `
                $('.carousel').carousel();
              })

              .catch(err => {
                // console.error(err)
                document.getElementById(`${i}`).innerHTML = `
                <a class="carousel-item" href="#two!"><img src="${tracks[i].album.images[0].url}"> <div id="0">0</div></a>
                <p>Artist: ${tracks[i].artists[0].name} Song Title: ${tracks[i].name}. 
                There is no lyrics for the song</p>
                `
                $('.carousel').carousel();
              })
          }

          // let allImages = []
          // for (i= 0; i < tracks.length; i++) {
          //   image = tracks[i].album.images[0].url || "https://player.tritondigital.com/tpl/default/html5/img/player/default_cover_art.jpg"
          //   allImages.push(image)
          //   console.log(allImages)
          // }

          // playlist.innerHTML = ''

          // playlist.innerHTML = `

          //   <div class="carousel">

          //  <a class="carousel-item" href="#two!"><img src="${allImages[0]}"> <div id="0">0</div></a>
          //  <a class="carousel-item" href="#three!"><img src="${allImages[1]}"><div id="1">1</div></a>
          //  <a class="carousel-item" href="#four!"><img src="${allImages[2]}"><div id="2">2</div></a>
          //   <a class="carousel-item" href="#five!"><img src="${allImages[3]}"><div id="3">3</div></a>
          //   <a class="carousel-item" href="#six!"><img src="${allImages[4]}"><div id="4">4</div></a>
          //   <a class="carousel-item" href="#seven!"><img src="${allImages[5]}"><div id="5">5</div></a>
          //   <a class="carousel-item" href="#eight!"><img src="${allImages[6]}"><div id="6">6</div></a>
          //   <a class="carousel-item" href="#nine!"><img src="${allImages[7]}"><div id="7">7</div></a>
          //   <a class="carousel-item" href="#ten!"><img src="${allImages[8]}"><div id="8">8</div></a>
          //   <a class="carousel-item" href="#ten!"><img src="${allImages[9]}"><div id="9">9</div></a>


          // </div>
          // `
          // $('.carousel').carousel();


        })
        .catch(err => {
          console.error(err)
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
    // <<<<<<< HEAD
    //     city.value === '' ||
    //     !moodSelected()) {
    // =======
    city.value === '' ||
    !moodSelected()) {
    console.log(name.value)
    console.log(city.value)

    let required = document.getElementById('requireAll')
    required.innerHTML = `Please fill in all inputs.`
  } else {
    getWeatherData(name.value, city.value, mood)
  }
})

