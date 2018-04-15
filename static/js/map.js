var socket = io()
, i = 0
, stopPropagation = 0
, showList = 0
, driverList = []
, map
, lastpos
, pos 
, pointer
, marker
, markers = []
, requestDetails = {
    userId: 1,
    colorId:1,
    location: {
        address: "Av. de Mayo 720 C1070AAP CABA, Argentina",
        latitude: -34.608724,
        longitude: -58.376867
    }
}
, getAddressFromLatLng = function(lat,lng){
    var deferred = new $.Deferred()
    $.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' +  lng + ',' + lat + '.json?country=ar&access_token=' + H.mapbox.accessToken,function(res){
        deferred.resolve(res.features)
    })
    return deferred.promise()
}
, setAddressFromLatLng = function(res){
    $('#userPosition').val(res[0].properties.address||"")
}

// socket 

socket.emit('join'); //Join a room, roomname is the userId itself!

//Listen for a 'request-accepted' event
socket.on('location', function(res) {
    var match = _.findIndex(driverList, {userId: res.userId})
    if(match>-1){
        driverList.splice(match, 1, res)
    } else {
        driverList.push(res);
    }

    $('#driverDetails').html($.templates("#details").render({drivers:driverList,count:driverList.length,showList:showList}, H.driver))

    if(markers[res.userId]){
        markers[res.userId].setLatLng(new L.LatLng(res.location.latitude, res.location.longitude))
    } else {
        markers[res.userId] = L.marker([res.location.latitude, res.location.longitude],{icon:H.icon(res)}).addTo(map)
    }    
})

socket.on('disconnect', function(data) {
    var match = _.findIndex(driverList, {userId: data.userId})
    // order by distance driverList
    if(match>-1){
        driverList.splice(match, 1)
    } 

    $('#driverDetails').html($.templates("#details").render({count:driverList.length,showList:showList}, H.driver))

    if(markers[data.userId]){
        map.removeLayer(markers[data.userId])
        delete markers[data.userId]
    }
})

// map

L.mapbox.accessToken = H.mapbox.accessToken

//Load the map and set it to a given lat-lng
map = L.mapbox.map('map', 'mapbox.streets');
map.setView([-34.608724, -58.376867], 15);

//Display a default marker
marker = L.marker([-34.608724, -58.376867], {icon:H.icon({userId:"",displayName:"",className:'me',colorId:1})}).addTo(map);

$('#driverDetails').html($.templates("#details").render({drivers:driverList,count:driverList.length,showList:showList}, H.driver))

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


$(document).on('click','#driverDetails .content', function(){
    if($(this).hasClass('show')){
        $(this).removeClass('show')
        showList = 0
    } else {
        showList = 1
        $(this).addClass('show')
    }
});

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
*/
/*
$(document).on('click','.icon.me', function(){
    stopPropagation = 1
    H.notif.set('#miperfil')
})

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