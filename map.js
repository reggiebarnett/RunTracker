// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var map;
var markers = [];
var directionsDisplay;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 18
  });

  var addText = document.getElementById('distanceLabel');
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(addText);

  //var infoWindow = new google.maps.InfoWindow({map: map});
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, preserveViewport: true});
  directionsDisplay.setMap(map);
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);

      /*var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: 'dickmarker2.png'
      });

      

      google.maps.event.addListener(marker, 'click', function(e) {
        infoWindow.open(map, marker);
      });
*/
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Hookup event listeners

  google.maps.event.addListener(map, 'click', function(event) {
    clickMap(event.latLng);
  });

  


}

function clickMap(location) {
  var icon = {
    url: "running.png", // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(24, 24) // anchor
  };
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: icon
  });

  google.maps.event.addListener(marker, 'rightclick', function(event){
    removeMarker(event);
  })

  markers.push(marker);
  console.log('new marker added '+ markers.length);
  if(markers.length>1){
    displayRoute();
  }
}

function displayRoute(){
  var start = markers[0].getPosition();
  var end = markers[markers.length - 1].getPosition();
  var waypts = [];
  for(var i = 1;i<markers.length-1;i++){
    waypts.push({location: markers[i].getPosition(), stopover: true});
    console.log("waypoint added");
  }

  directionsDisplay.setMap(map);
  var request = {
    origin: start,
    waypoints: waypts,
    destination: end,
    travelMode: google.maps.TravelMode.WALKING
  };

  var directionService = new google.maps.DirectionsService();
  var distance = 0;
  directionService.route(request, function(response, status){
    if(status == google.maps.DirectionsStatus.OK){
      for(var i = 0; i < response.routes[0].legs.length;i++){
        distance += response.routes[0].legs[i].distance.value;;
      }

      //converting to miles
      distance *= 3.28084/5280;

      document.getElementById("distanceLabel").innerHTML = distance.toFixed(2)+ " miles";
      directionsDisplay.setDirections(response);
    }
  });
}

function removeMarker(marker){
 for(var i = 0; i < markers.length;i++){
  if(markers[i].getPosition().lat() == marker.latLng.lat() && markers[i].getPosition().lng() == marker.latLng.lng() ){
    break;
  }
 }
    markers[i].setMap(null);
    directionsDisplay.setMap(null);
    markers.splice(i,1);
    displayRoute();
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}