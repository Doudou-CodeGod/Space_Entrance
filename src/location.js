// Replace 'YOUR_API_KEY' with the API key you got from OpenCage Data
const apiKey = 'a41edf16343041faba4f8a61db8be9f7';

// Get the intro text element
const introText = document.querySelector('.intro-text');

function updateLocationText(city) {
    const locationElement = document.getElementById('location');
    locationElement.textContent = city;
  introText.innerHTML = introText.innerHTML.replace('earth', city);
}

function reverseGeocode(lat, lng) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const city = data.results[0].components.city;
      updateLocationText(city);
    })
    .catch(err => {
      console.error('Error fetching location:', err);
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    reverseGeocode(lat, lng);
  }, err => {
    console.error('Error getting user location:', err);
  });
} else {
  console.error('Geolocation not supported in this browser');
}
