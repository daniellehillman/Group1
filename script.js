var instance = M.Carousel.init({
  fullWidth: true,
  indicators: true
})



// let moodString = ''
// let cityString = ''
// let finalString = ''


function cold (){


}

function midrange() {

}

function sunny () {


}

function rain() {


}
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
 
    document.getElementById('submit').addEventListener('click', event => {
      event.preventDefault()

      let city = document.getElementById('city').value

      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
        .then(res => {
          console.log(res.data)
          document.getElementById('test').innerHTML = `
          <h1>${res.data.name}</h1>
          <h2>Weather: ${res.data.weather[0].description}</h2>
          <h3>Temperature: ${res.data.main.temp}</h3>
        
        `
        })

        .catch(err => { console.log(err) })

    })


   if (res.data.weather[0].description === "rain") {
     rain()
   
   } else if (res.data.main.temp < 60) {
    cold()
  } else if (60 <= res.data.main.temp && res.data.main.temp < 75) {
    midrange()

  } else if (res.data.main.temp >= 75) {
    sunny()
  }

 
        
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, options);
  });
