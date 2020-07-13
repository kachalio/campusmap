var map, infoWindow, markers = [];
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 18
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     var pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };

    //     updateLocationInput(pos);
    //     placeMarker(pos);

    //     map.setCenter(pos);
    //   }, function() {
    //     handleLocationError(true, infoWindow, map.getCenter());
    //   });
    // } else {
    //   // Browser doesn't support Geolocation
    //   handleLocationError(false, infoWindow, map.getCenter());
    // }

    codeAddress();

    google.maps.event.addListener(map, 'click', function (event) {

        placeMarker(event.latLng);
        updateLocationInput(event.latLng);
    });


}

function codeAddress() {
    var address = document.getElementById('site_address').innerHTML;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function placeMarker(location) {
    removeMarkers();
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker)
}

function removeMarkers() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function updateLocationInput(pos) {
    $("#id_latitude").val(pos.lat);
    $("#id_longitude").val(pos.lng);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);

}

//Click listener for "get my location" button
$("#get_location").click(function () {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            updateLocationInput(pos);
            placeMarker(pos);

            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

});
