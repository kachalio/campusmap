/*

Asynchronous queries and functions are a SOB.  Just know that

*/


var map, geocoder;
// Should update these to use JQuery to keep things consistant
var ajax_url = $("#ajax_site_list").attr("data-url");
var address = "2106 McDowell Street Augusta GA 30904";
var map;
var searchOptions = {
    view: 'Auto',
    limit: 1    //Only need one result per address.
};
var addresses = [];
var subscriptionKey = "SjW7oYEjKdmrVfL8K-i4c2GJZ0H1Gd9p91A9bimaa2c";
var site_datasource;


function initMap() {

    //Instantiate a map object
    map = new atlas.Map("map", {
        //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: 'SjW7oYEjKdmrVfL8K-i4c2GJZ0H1Gd9p91A9bimaa2c'
        }
    });

    // Use SubscriptionKeyCredential with a subscription key
    var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

    // Use subscriptionKeyCredential to create a pipeline
    var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

    // Running Query to get all sites  from DB
    // All addresses are saved into var addresses[]
    // I'm sorry, but there's a bunch of functions that call other functions and it is probably hard to read, but hey... it works.
    getSiteListAjax();

    // Map Ready Listener
    map.events.add('ready', function () {
        //Create a data source and add it to the map.
        site_datasource = new atlas.source.DataSource();
        map.sources.add(site_datasource);

        //Add a layer for rendering point data.
        var resultLayer = new atlas.layer.SymbolLayer(site_datasource, null, {
            iconOptions: {
                image: 'marker-darkblue',
                anchor: 'bottom',
                allowOverlap: true
            },
            textOptions: {
                anchor: "top"
            }
        });
        map.layers.add(resultLayer);
    });
}

function getSiteListAjax() {
    // This is an asynchronous query that receives all the sites from the project database.
    // Upon a succesful response, it will pass the data to the handleData() function
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

function handleData(data) {
    if (data) {
        for (x = 0; x < data.sites.length; x++) {
            var address = data.sites[x].streetAddress.replace(/#/g, "");
            addresses.push(address);
        }
        asyncBatchGeocode(addresses);
    }
}

async function asyncBatchGeocode(query_addresses) {
    var query_location_header;
    var query = { "batchItems": [] };
    for (var x = 0; x < query_addresses.length; x++) {
        query.batchItems.push({ query: '?query=' + encodeURIComponent(query_addresses[x]) });
    }


    await postData("https://atlas.microsoft.com/search/address/batch/json?subscription-key=" + subscriptionKey + "&api-version=1.0", query)
        .then(data => {
            query_location_header = data.headers.get('location');
        })
        .then(data => {
            getData(query_location_header)
        })
}

// This makes a POST request to Azure Maps API with for batch Address Geocoding
async function postData(url, data) {

    //Make a synchronous batch geocode request which allows up to 100 items per batch.
    //Note: There is an asynchronous version of this service that allows up to 10,000 items per batch but requires accessing response headers which is blocked by JavaScript at this time.

    

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Expose-Headers': 'Location',
        },
        body: JSON.stringify(data),
        redirect: 'follow'
    };

    var response = await fetch(url, requestOptions);
    

    return response;
}

// This will make a GET request to the url returned by the POST request.  This contains the data in JSON.
async function getData(url) {
    
    var site_data;

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    //await fetch(url, requestOptions)
    fetch(url)
        .then(response => response.json())
        .then(json => processBatchResponse(json));
}

//Adds sites to the map based on their lat and long.
function processBatchResponse(sites) {
    //Convert the response into GeoJSON objects.
    bounds = []
    // console.log(sites);
    for (var x = 0; x < sites.batchItems.length; x++) {
        if (sites.batchItems[x].response.results.length < 1){
            console.log("Not found: " + sites.batchItems[x].response.summary.query);
            // console.log(site.response);
        }
        else{
            var site = sites.batchItems[x].response.results[0];
            var lat = site.position.lat;
            var lon = site.position.lon;
            bounds.push([lon, lat])
            site_datasource.add(new atlas.data.Point([lon, lat]));
        }
        
    }

    var bbox = new atlas.data.BoundingBox.fromLatLngs(bounds);
    // set camera to bounds to show the results
    map.setCamera({
        bounds: bbox,
        zoom: 5,
        padding: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
        }

    });


}


function query(searchURL, map){
    // Trying a search
    var query = "2106 McDowell Street Augusta GA 30904";

    searchURL.searchAddress(atlas.service.Aborter.timeout(10000), query, {limit:1}).then((results) => {
        // Extract GeoJSON feature collection from the response and add it to the datasource
        
        var data = results.geojson.getFeatures();
        
        site_datasource.add(data);

        
    });

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
    getSiteListAjax(map);
});

$(document).ready(function (){
    initMap();
});