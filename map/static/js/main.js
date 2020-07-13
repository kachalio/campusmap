var map, geocoder;
function initMap() {
    var myLatLng = { lat: -25.363, lng: 131.044 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });
}

function codeAddress(address) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var myOptions = {
                zoom: 17,
                center: results[0].geometry.location,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map"), myOptions);

            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });
}

$("button.btn").click(function () {
    console.log($(this).val());
    codeAddress($(this).val());
});

// Everything below here I copied from a previous commit because I somehow lost it
// I need this code so i don't forget how stuff works...
function createMarker(name, position) {
    var contentString = "<p>" + name + "</p>";

    var infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    var new_marker = new google.maps.Marker({
        map: map,
        position: position,
        title: name,
        label: name
    });

    new_marker.addListener('click', function () {
        infoWindow.open(map, new_marker);
    });

    return new_marker;
}

function drawClosetMarkers(closets) {

    for (x = 0; x < closets.length; x++) {
        var myLatLng = { lat: parseFloat(closets[x].latitude), lng: parseFloat(closets[x].longitude) };

        var contentString = "<p>" + closets[x].name + "</p>";

        var marker = createMarker(closets[x].name, myLatLng);

    }
}

function createLine(coordinates) {

    var line = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    line.setMap(map);
}

function drawFiberRuns(fiber_runs) {
    for (x = 0; x < fiber_runs.length; x++) {
        var coordinates = [
            {
                lat: parseFloat(fiber_runs[x].start_closet.lat),
                lng: parseFloat(fiber_runs[x].start_closet.lng)
            },
            {
                lat: parseFloat(fiber_runs[x].end_closet.lat),
                lng: parseFloat(fiber_runs[x].end_closet.lng)
            }
        ];
        createLine(coordinates);
    }
}

function drawSiteMap(address, closets, name, fiber_runs) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var myOptions = {
                zoom: 17,
                center: results[0].geometry.location,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map"), myOptions);

            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: address,
                label: name
            });

            drawClosetMarkers(closets);
            drawFiberRuns(fiber_runs);
        }
    });
}



$("button.btn").click(function () {
    var sitePk = $(this).val();

    $.ajax({
        url: '{% url "get_site_data" %}',
        data: { 'pk': sitePk },
        dataType: 'json',
        error: function (data) {
            console.log("done fuxed up");
        },
        success: function (data) {
            if (data) {
                drawSiteMap(data.site.streetAddress, data.closets, data.site.name, data.fiber_runs);

            }
        },

    });
});
