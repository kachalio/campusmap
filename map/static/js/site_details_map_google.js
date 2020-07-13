var map, geocoder;
// Should update these to use JQuery to keep things consistant
var address = document.getElementById("siteAddress").innerHTML;
var site_id = document.getElementById("siteId").innerHTML;
var ajax_url = $("#ajax_url").attr("data-url");


console.log(ajax_url);

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

function initMap() {
    var myLatLng;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            myLatLng = results[0].geometry.location;
            console.log(results);
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 17,
                center: myLatLng,
            });

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Hello World!'
            });

            $.ajax({
                url: ajax_url,
                data: { 'pk': site_id },
                dataType: 'json',
                error: function (data) {
                    console.log("done fuxed up");
                },
                success: function (data) {
                    if (data) {
                        drawClosetMarkers(data.closets);
                    }
                },

            });
        }
        else{
            console.log("not ok");
        }
    }); 

    

}