var socket = io()
, i = 0
, userId = document.body.getAttribute("data-userId")
, requestDetails = {}
, carrierDetails = {}
, carrierList = []
, map
, lastpos
, pos 
, pointer
, marker
, markers = []
, requestDetails = {
    userId: userId,
    colorId:1,
    location: {
        address: "Av. de Mayo 720 C1070AAP CABA, Argentina",
        latitude: -34.608724,
        longitude: -58.376867
    }
}
, acceptJob = function () {
    //On clicking the button, emit a 'request-accepted' event/signal and send relevant info back to server
    H.notif.hide()
}
, cancelJob = function () {
    //On clicking the button, emit a 'request-accepted' event/signal and send relevant info back to server
    socket.emit('request-canceled', {
        requestDetails: requestDetails
    })
}
, acceptPointer = function(){
    cancelPointer()

    setTimeout(function(){
        //Display Carrier details
        $('#notification').html($.templates("#mensajeroencamino").render(carrierDetails, H.carrier)).fadeIn('fast')
    },200)
}
, cancelPointer = function(){
    $("#notification").fadeOut('fast')
    map.removeLayer(pointer)
    map.setView(pos ? pos : [-34.608724, -58.376867], 15)            
}
, fixPointer = function(){
    $("#notification").fadeOut('fast')
    map.setView(pos ? pos : [-34.608724, -58.376867], 19)
}
, initPointer = function(e) {

    if(pointer) map.removeLayer(pointer)

    pointer = L.marker([e.latlng.lat,e.latlng.lng], {
        icon: H.icon({colorId:5,sizeId:3})
    }).addTo(map)

    map.setView([e.latlng.lat,e.latlng.lng], 19)

    setTimeout(function(){
        $.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' +  e.latlng.lng + ',' + e.latlng.lat + '.json?country=ar&access_token=' + H.mb.accesstoken,function(res){
            H.notif.set('#notification','#eligedestino',{features:res.features})
        })                
    },500)
}
, requestForHelp = function () { //When button is clicked, emit an event
    socket.emit('request-for-help', requestDetails);
}

socket.emit('join', {
    userId: userId
}); //Join a room, roomname is the userId itself!

//Listen for a 'request-accepted' event
socket.on('location', function(res) {

    var match = _.indexOf(carrierList, _.find(res, {id: 1}));

    if(match){
        carrierList.splice(match, 1, res);
    } else {
        carrierList.push(res);
    }

    if(markers[res.displayName]){
        markers[res.displayName].setLatLng(new L.LatLng(res.location.lat, res.location.lng))
    } else {
        markers[res.displayName] = L.marker([res.location.lat, res.location.lng],{icon:H.icon(res)}).addTo(map)
        /*
        markers[data.carrier] = L.marker([data.location.lat, data.location.lng], {
            icon: L.icon({
                iconUrl: '/images/carrier.png',
                iconSize: [60, 28]
            })
        }).addTo(map)*/
    }

    $('#carrierDetails').html($.templates("#details").render(carrierList, H.carrier))
})

socket.on('request-accepted', function(data) {
    console.log("request-accepted")
    
    carrierDetails = data; //Save carrier details

    //Display Carrier details
    $('#notification').html($.templates("#mensajeroencamino").render(carrierDetails, H.carrier)).fadeIn('fast')

    //Show carrier location on the map
    L.marker([carrierDetails.location.latitude, carrierDetails.location.longitude],{icon:H.icon(data)}).addTo(map)

    /*
    L.marker([carrierDetails.location.latitude, carrierDetails.location.longitude], {
        icon: L.icon({
            iconUrl: '/images/carrier.png',
            iconSize: [60, 28]
        })
    }).addTo(map);*/

});

L.mapbox.accessToken = H.mb.accesstoken

//Load the map and set it to a given lat-lng
map = L.mapbox.map('map', 'mapbox.streets');
map.setView([-34.608724, -58.376867], 15);

//Display a default marker
marker = L.marker([-34.608724, -58.376867], {icon:H.icon({displayName:"Yo",colorId:2})}).addTo(map);

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

map.on('click', function(e){
    initPointer(e)
    pos = [e.latlng.lat,e.latlng.lng]
})

H.geo(function(position) {
    i++
    var latitude  = position.coords.latitude
    , longitude = position.coords.longitude

    marker.setLatLng([latitude, longitude]).update()

    if(i==1) {
        map.setView([latitude,longitude], 15)
    }

    pos = [latitude,longitude]
})