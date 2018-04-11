        /*
        markers[data.driver] = L.marker([data.location.lat, data.location.lng], {
            icon: L.icon({
                iconUrl: '/images/driver.png',
                iconSize: [60, 28]
            })
        }).addTo(map)*/



    /*
    L.marker([driverDetails.location.latitude, driverDetails.location.longitude], {
        icon: L.icon({
            iconUrl: '/images/driver.png',
            iconSize: [60, 28]
        })
    }).addTo(map);*/

/*
//Use MapBox geo-coding API
map.addControl(L.mapbox.geocoderControl('mapbox.places', {
    autocomplete: true,
}).on('select', function(data) {
    //This function runs when a place is selected

    //data contains the geocding results
    console.log(data);

    //Do something with the results

    //Extract address and coordinates from the results and save it
    requestDetails.location = {
        address: data.feature["place_name"],
        latitude: data.feature.center[1],
        longitude: data.feature.center[0]
    };

    //Set the marker to new location
    marker.setLatLng([data.feature.center[1], data.feature.center[0]])
}))
*/ 


            //Use MapBox geo-coding API
            map.addControl(L.mapbox.geocoderControl('mapbox.places', {
                autocomplete: true,
            }).on('select', function(data) {
                //This function runs when a place is selected

                //data contains the geocding results
                //console.log(data);

                //Do something with the results

                //Set the marker to new location
                marker.setLatLng([data.feature.center[1], data.feature.center[0]]);
            }));   