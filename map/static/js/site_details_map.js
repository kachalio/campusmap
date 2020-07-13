var map, geocoder;
// Should update these to use JQuery to keep things consistant
var address = document.getElementById("siteAddress").innerHTML;
var site_id = document.getElementById("siteId").innerHTML;
var ajax_url = $("#ajax_url").attr("data-url");
// Azure Maps Stuff
var map;
var searchOptions = {
    view: 'Auto',
    limit: 1    //Only need one result per address.
};
var addresses = [];
var bounds =[];
var subscriptionKey = "SjW7oYEjKdmrVfL8K-i4c2GJZ0H1Gd9p91A9bimaa2c";
var searchURL;
var site_datasource;
var closet_datasource;



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

    //Instantiate a map object
    map = new atlas.Map("map", {
        //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
        //view: "auto",
        style: "satellite",
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: 'SjW7oYEjKdmrVfL8K-i4c2GJZ0H1Gd9p91A9bimaa2c'
        },
    });


    // Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    // Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    // IDK why macrosoft makes this so hard
    searchURL = new atlas.service.SearchURL(pipeline); 

    // Map Ready Listener
    map.events.add('ready', function () {
        //Create a data source and add it to the map.
        site_datasource = new atlas.source.DataSource();
        map.sources.add(site_datasource);

        closet_datasource = new atlas.source.DataSource();
        map.sources.add(closet_datasource);

        //Add a layer for rendering point data.
        var siteLayer = new atlas.layer.SymbolLayer(site_datasource, null, {
            iconOptions: {
                image: 'pin-blue',
                anchor: 'bottom',
                allowOverlap: true
            },
            textOptions: {
                
            }
        });
        map.layers.add(siteLayer);

        var closetLayer = new atlas.layer.SymbolLayer(closet_datasource, null, {
            iconOptions: {
                image: 'pin-round-red',
                anchor: 'center',
                allowOverlap: true
            },
            textOptions: {
                font: [
                    "SegoeUi-Regular"
                ],
                haloColor: "#000000",
                offset: [
                    0,
                    0
                ],
                textField: [
                    "get",
                    "title"
                ],
                pitchAlignment: "viewport"
            }
        });
        map.layers.add(closetLayer);
    });

    getSiteDetailAjax()
        .then((data) => {
            geocodeOneAddress(data.site.streetAddress, data.closets);
        })
        .then((data)=>{
            // set camera to bounds to show the results
            
        })
        .catch((error) => {
            console.log(error);
        });
}


function getSiteDetailAjax() {

    return new Promise((resolve, reject) => {
        // This is an asynchronous query that receives all the sites from the project database.
        // Upon a succesful response, it will pass the data to the handleData() function
        $.ajax({
            url: ajax_url,
            data: { 'pk': site_id },
            dataType: 'json',
            error: function(data) {
                reject(error);
            },
            success: function(data){
                resolve(data);
            },
        });
    })
}

function handleData(data) {
    if (data) {
        var closet_points = [];
        for (x = 0; x < data.closets.length; x++) {
            var closet_point = new atlas.data.Point(
                [data.closets[x].longitude, data.closets[x].latitude],
                {
                    title: "asdf"
                }
            );
            closet_points.push(closet_point);
        }
        geocodeOneAddress(data.site.streetAddress, closet_points);
    }
}

function geocodeOneAddress(siteAddress, closets){

    searchURL.searchAddress(atlas.service.Aborter.timeout(10000), siteAddress.replace(/#/g, ""), {limit:1})
        .then( results => {   
            var geoFeatures = results.geojson.getFeatures();
            
            site_datasource.add(geoFeatures);
            bounds.push(geoFeatures.features[0].geometry.coordinates);
            for (x = 0; x < closets.length; x++) {
                console.log(closets[x]);
                if (closets[x].longitude != null && closets[x].latitude != null){
                    var closet_point = new atlas.data.Point([closets[x].longitude, closets[x].latitude], {title:"asdf"});
                    closet_datasource.add(closet_point);
                    bounds.push([parseFloat(closets[x].longitude), parseFloat(closets[x].latitude)]);
                }
                
            }
            console.log(bounds);
            var bbox = new atlas.data.BoundingBox.fromLatLngs(bounds);
            map.setCamera({
                bounds: bbox,
                zoom: 5,
                padding: {
                    top: 100,
                    bottom: 100,
                    left: 100,
                    right: 100,
                }

            });
        });    
}

$(document).ready(function () {
    initMap();
});