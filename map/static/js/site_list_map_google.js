var map, geocoder;
// Should update these to use JQuery to keep things consistant
var ajax_url = $("#ajax_site_list").attr("data-url");
var address = "2106 McDowell Street Augusta GA 30904";
var map;


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

function handleData(data){
    if (data) {
        // If the request is made successfully, and we return data and go here
        // Now the fun begins. Looping through each site
        var bounds = new google.maps.LatLngBounds();

        for (x = 0; x < data.sites.length; x++) {

            // Calling the google Geocoder service
            geocoder.geocode({ 'address': data.sites[x].streetAddress }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    myLatLng = results[0].geometry.location;

                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        title: name,
                    });
                    bounds.extend(marker.position);
                    map.fitBounds(bounds);
                }
                else {
                    console.log(status);
                }
            });
        }

    }

}

function getDataAjax(map) {
    $.ajax({
        url: ajax_url,
        data: {},
        dataType: 'json',
        error: function (data) {
            console.log("done fuxed up");
        },
        success: handleData

    });
}

function initMap() {
    var myLatLng = { lat: 39, lng: -107 };
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: myLatLng,
    });
    // This Ajax function calls asynchronously calls the db to get all sites
    getDataAjax(map);

}

function zoomAddress(address) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.panTo(results[0].geometry.location);
            map.setZoom(10);
        }
    });
}



$(".btn-zoom").click(function () {
    //Need to fix this so it gets the address not the site ID
    console.log($(this).val());
    zoomAddress($(this).val());
});

$("#reset_zoom").click(function () {
    //Need to fix this so it gets the address not the site ID
    getDataAjax(map);
});