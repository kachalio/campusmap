function initMap() {
    console.log("hello");
    //Instantiate a map object
    map = new atlas.Map("map", {
        //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
        style: 'satellite',
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: 'SjW7oYEjKdmrVfL8K-i4c2GJZ0H1Gd9p91A9bimaa2c'
        }
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
        new_closet_datasource = new atlas.source.DataSource();
        map.sources.add(site_datasource);
        map.sources.add(new_closet_datasource);

        // Getting the Site Address to default zoom to
        var zoom_address = document.getElementById('site_address').innerHTML;
        searchURL.searchAddress(atlas.service.Aborter.timeout(10000), zoom_address.replace(/#/g, ""), { limit: 1 })
            .then(results => {
                var geoFeatures = results.geojson.getFeatures();
                console.log(geoFeatures);
                site_datasource.add(geoFeatures);
                
                map.setCamera({
                    center: geoFeatures.features[0].geometry.coordinates,
                    zoom: 17,
                });
            }); 

        //Add a layer for rendering point data.
        var siteLayer = new atlas.layer.SymbolLayer(site_datasource, null, {
            iconOptions: {
                image: 'marker-darkblue',
                anchor: 'bottom',
                allowOverlap: true
            },
            textOptions: {
                anchor: "top"
            }
        });
        map.layers.add(siteLayer);

        //Add a layer for rendering point data.
        var newClosetLayer = new atlas.layer.SymbolLayer(new_closet_datasource, null, {
            iconOptions: {
                image: 'marker-red',
                anchor: 'center',
                allowOverlap: true
            },
            textOptions: {
                anchor: "top"
            }
        });
        map.layers.add(newClosetLayer);

        /* Gets co-ordinates of clicked location*/
        map.events.add('click', function (e) {
            new_closet_datasource.clear();
            var point = new atlas.Shape(new atlas.data.Point());
            
            /* Update the position of the point feature to where the user clicked on the map. */
            point.setCoordinates(e.position);
            new_closet_datasource.add(point);
            console.log(point);
            
            $("#id_longitude").val(point.data.geometry.coordinates[0]);
            $("#id_latitude").val(point.data.geometry.coordinates[1]);
        });

    });
}

$(document).ready(function () {
    initMap();
});