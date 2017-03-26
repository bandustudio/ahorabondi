var socket = io()
, i = 0
, stopPropagation = 0
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
    H.notif.hide()
}
, cancelJob = function () {
    socket.emit('request-canceled', {
        requestDetails: requestDetails
    })
}
, acceptPointer = function(){
    cancelPointer()

    setTimeout(function(){
        $('#notification').html($.templates("#mensajeroencamino").render(carrierDetails, H.carrier)).fadeIn('fast')
    },200)
}
, cancelPointer = function(){
    $("#map.selection,icon.selection").removeClass('selection')
    map.removeLayer(pointer)
    map.setView(pos ? pos : [-34.608724, -58.376867], 15)
    $("#notification").fadeOut('fast')
}
, fixPointer = function(){
    map.setView(pos ? pos : [-34.608724, -58.376867], 19)
    $("#notification").fadeOut('fast')
}
, initPointer = function(e) {

    if(pointer) map.removeLayer(pointer)

    pointer = L.marker([e.latlng.lat,e.latlng.lng], {
        icon: H.icon({colorId:5,displayName:"Tu envío"})
    }).addTo(map)

    map.setView([e.latlng.lat,e.latlng.lng], 16)

    setTimeout(function(){
        $.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' +  e.latlng.lng + ',' + e.latlng.lat + '.json?country=ar&access_token=' + H.mb.accesstoken,function(res){
            H.notif.set('#notification','#eligedestino',{features:res.features},null,function(){
                // show carriers
                $(".choosecarrier").html($('#carrierDetails').html())
            })
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
    var match = _.findIndex(carrierList, {displayName: res.displayName})

    // order by distance carrierList
    if(match>-1){
        carrierList.splice(match, 1, res)
    } else {
        carrierList.push(res);
    }
    
    $('#carrierDetails').html($.templates("#details").render(carrierList, H.carrier))

    if(markers[res.displayName]){
        markers[res.displayName].setLatLng(new L.LatLng(res.location.latitude, res.location.longitude))
    } else {
        markers[res.displayName] = L.marker([res.location.latitude, res.location.longitude],{icon:H.icon(res)}).addTo(map)
    }    
})

socket.on('request-accepted', function(data) {
    console.log("request-accepted")
    
    carrierDetails = data; //Save carrier details
    carrierDetails.className = 'icon-carrier'

    //Display Carrier details
    $('#notification').html($.templates("#mensajeroencamino").render(carrierDetails, H.carrier)).fadeIn('fast')

    //Show carrier location on the map
    L.marker([carrierDetails.location.latitude, carrierDetails.location.longitude],{icon:H.icon(data)}).addTo(map)
});

L.mapbox.accessToken = H.mb.accesstoken

//Load the map and set it to a given lat-lng
map = L.mapbox.map('map', 'mapbox.streets');
map.setView([-34.608724, -58.376867], 15);

//Display a default marker
marker = L.marker([-34.608724, -58.376867], {icon:H.icon({displayName:"Yo",className:'me',colorId:2})}).addTo(map);

map.on('click', function(e){
    setTimeout(function(){
        var sp = stopPropagation
        stopPropagation = 0
        if(sp) return false
        pos = [e.latlng.lat,e.latlng.lng]
        initPointer(e)        
    },100)
})

$(document).on('click','.icon:not(.me)', function(){
    var $span = $(this).find("> span")
    , sel = 'selection'

    if(!$span.hasClass(sel)){
        $span.addClass(sel)
        $('#map').addClass(sel)
    } else {
        $span.removeClass(sel)
        $('#map').removeClass(sel)
    }
    stopPropagation = 1
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