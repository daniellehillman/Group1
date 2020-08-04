var instance = M.Carousel.init({
  fullWidth: true,
  indicators: true
})





{<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
 
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


  function geoFindMe() {

    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');
  
    mapLink.href = '';
    mapLink.textContent = '';
  
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      status.textContent = '';
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
     console.log(`Latitude: ${latitude} °, Longitude: ${longitude} °`);
    }
  
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }
  
    if(!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  
  }
  
  document.querySelector('#find-me').addEventListener('click', geoFindMe);


}






 
        
  // document.addEventListener('DOMContentLoaded', function() {
  //   var elems = document.querySelectorAll('.dropdown-trigger');
  //   var instances = M.Dropdown.init(elems, options);
  
