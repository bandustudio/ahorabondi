function geoFindMe(success, error) {
  if (!navigator.geolocation){
    alert("Geolocation is not supported by your browser")
    return;
  }

  function error() {
    alert("Unable to retrieve your location")
  }

  navigator.geolocation.watchPosition(success, error);
}