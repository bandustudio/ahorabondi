var socket = io()
, i = 0
, stopPropagation = 0
, userId = document.body.getAttribute("data-userId")
, requestDetails = {}
, driverDetails = {}
, driverList = []
, map
, lastpos
, inputstep = 'step_from'
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
        //$('#notification').html($.templates("#mensajeroencamino").render(driverDetails, H.driver)).fadeIn('fast')
        H.notif.set('#mensajeroencamino',driverDetails,H.driver)
    },200)
}
, cancelPointer = function(){
    $("icon.selection").removeClass('selection')
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
        icon: H.icon({colorId:5,displayName:"<span>TU ENVÍO</span>"})
    }).addTo(map)

    map.setView([e.latlng.lat,e.latlng.lng], 16)

    setTimeout(function(){
        $.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' +  e.latlng.lng + ',' + e.latlng.lat + '.json?country=ar&access_token=' + H.mapbox.accessToken,function(res){
            H.notif.set('#eligedestino',{features:res.features},{},function(){
                // show drivers
                $(".choosedriver").html($('#driverDetails').html())
            })
        })                
    },500)
}
, requestForHelp = function () { //When button is clicked, emit an event
    socket.emit('request-for-help', requestDetails);
}
, getAddressFromLatLng = function(lat,lng){
    var deferred = new $.Deferred()
    $.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' +  lng + ',' + lat + '.json?country=ar&access_token=' + H.mapbox.accessToken,function(res){
        deferred.resolve(res.features)
    })
    return deferred.promise()
}
, setAddressFromLatLng = function(res){
    $('#'+inputstep).val(res[0].properties.address||"")
    if(inputstep=="step_from" && res[0].properties.address){
        $('#step_to').attr('hidden',false).slideDown('slow').focus()
    }
    if($.trim($('#step_from').val()) != '' && $.trim($('#step_to').val()) != ''){
        $('#step_ready').attr('hidden',false).slideDown('slow')
    }
}


// socket 

socket.emit('join', {
    userId: userId
}); //Join a room, roomname is the userId itself!

//Listen for a 'request-accepted' event
socket.on('location', function(res) {
    var match = _.findIndex(driverList, {displayName: res.displayName})

    // order by distance driverList
    if(match>-1){
        driverList.splice(match, 1, res)
    } else {
        driverList.push(res);
    }
    
    $('#driverDetails').html($.templates("#details").render(driverList, H.driver))

    if(markers[res.displayName]){
        markers[res.displayName].setLatLng(new L.LatLng(res.location.latitude, res.location.longitude))
    } else {
        markers[res.displayName] = L.marker([res.location.latitude, res.location.longitude],{icon:H.icon(res)}).addTo(map)
    }    
})

socket.on('request-accepted', function(data) {
    console.log("request-accepted")
    
    driverDetails = data; //Save driver details
    driverDetails.className = 'icon-driver'

    //Display Driver details
    $('#notification').html($.templates("#mensajeroencamino").render(driverDetails, H.driver)).fadeIn('fast')
    H.notif.set('#mensajeroencamino',driverDetails,H.driver)

    //Show driver location on the map
    L.marker([driverDetails.location.latitude, driverDetails.location.longitude],{icon:H.icon(data)}).addTo(map)
});

// map

L.mapbox.accessToken = H.mapbox.accessToken

//Load the map and set it to a given lat-lng
map = L.mapbox.map('map', 'mapbox.streets');
map.setView([-34.608724, -58.376867], 15);

//Display a default marker
marker = L.marker([-34.608724, -58.376867], {icon:H.icon({displayName:"Yo",className:'me',colorId:2})}).addTo(map);

// events

$('body').on('mouseup touchend', function(e){
    setTimeout(function(){
        var center = map.getCenter().wrap()
        getAddressFromLatLng(center.lat, center.lng).then(function(res){
            if(res){
                setAddressFromLatLng(res)
            }
        })
    },100)    
})

/*
map.on('click', function(e){
    setTimeout(function(){
        var sp = stopPropagation
        stopPropagation = 0
        if(sp) return false
        pos = [e.latlng.lat,e.latlng.lng]
        initPointer(e)        
    },100)
})
*/
$(document).on('click','.icon:not(.me)', function(){
    var $span = $(this).find("> span")
    , $spans = [$span, $("#driverDetails > ." + $span.find("> span > span").text())]

    for(var i in $spans){
        if(!$spans[i].hasClass('selection')){
            $spans[i].addClass('selection')
        } else {
            $spans[i].removeClass('selection')
        }
    }
})

$(document).on('focus','#overlay input', function(){
    inputstep = $(this).attr('id')
})

$(document).on('click','.icon.me', function(){
    stopPropagation = 1
    H.notif.set('#miperfil')
})

/*
$(document).on('click','.with-options li', function(e){
    $('#eligedestino_text').val($(this).text())
    e.preventDefault()
})*/


// start listening

H.geo(function(position) {
    i++
    var latitude  = position.coords.latitude
    , longitude = position.coords.longitude

    marker.setLatLng([latitude, longitude]).update()

    if(i==1) {
        getAddressFromLatLng(latitude,longitude).then(function(res){
            if(res){
                setAddressFromLatLng(res)
            }
        })        
        map.setView([latitude,longitude], 15)
    }

    pos = [latitude,longitude]
})