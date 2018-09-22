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
    uuid: 1,
    colorId:1,
    location: {
        address: "Av. de Mayo 720 C1070AAP CABA, Argentina",
        latitude: -34.608724,
        longitude: -58.376867
    }
}
, setPos = function(latitude,longitude,zoom){
    map.setCenter([longitude,latitude])
    map.setZoom(zoom)
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

socket.emit('join'); //Join a room, roomname is the uuid itself!

//Listen for a 'request-accepted' event
socket.on('location', function(res) {
    var match = _.findIndex(driverList, {uuid: res.uuid})
    if(match>-1){
        driverList.splice(match, 1, res)
    } else {
        driverList.push(res);
    }

    $('#driverDetails').html($.templates("#details").render({
        drivers:driverList,
        count:driverList.length,
        showList:showList
    }, H.driver))

    if(markers[res.uuid]){
        markers[res.uuid].setLngLat([res.location.longitude,res.location.latitude])
        $(markers[res.uuid].getElement()).removeClass('pulse').addClass('pulse')
    } else {
        var el = document.createElement('div');
        el.innerHTML = H.icon(res)
        markers[res.uuid] = new mapboxgl.Marker(el)
        markers[res.uuid].setLngLat([res.location.longitude,res.location.latitude])
        markers[res.uuid].addTo(map)
    }    
})

socket.on('disconnect', function(data) {
    var match = _.findIndex(driverList, {uuid: data.uuid})
    // order by distance driverList
    if(match>-1){
        driverList.splice(match, 1)
    } 

    $('#driverDetails').html($.templates("#details").render({
        count:driverList.length,
        showList:showList
    }, H.driver))

    if(markers[data.uuid]){
        map.removeLayer(markers[data.uuid])
        delete markers[data.uuid]
    }
})

// map

mapboxgl.accessToken = H.mapbox.accessToken
map = new mapboxgl.Map({
    container: 'map',
    style: H.mapbox.style,
    center: [-58.376867,-34.608724],
    zoom: 15
})

var el = document.createElement('div');
el.innerHTML = H.icon({uuid:"",displayName:"me",className:'me'})
marker = new mapboxgl.Marker(el)
marker.setLngLat([-58.376867,-34.608724])
marker.addTo(map)
/*         
L.mapbox.accessToken = H.mapbox.accessToken

//Load the map and set it to a given lat-lng
map = L.mapbox.map('map', 'mapbox.streets');
map.setView([-34.608724, -58.376867], 15);

//Display a default marker
marker = L.marker([-34.608724, -58.376867], {icon:H.icon({uuid:"",displayName:"",className:'me',colorId:1})}).addTo(map);
*/

$('#driverDetails').html($.templates("#details").render({
    drivers:driverList,
    count:driverList.length,
    showList:showList
}, H.driver))

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

    marker.setLngLat([longitude,latitude])
    marker.addTo(map)
    $(marker.getElement()).find('span > span').removeClass('pulse').addClass('pulse')


    if(i==1) {
        getAddressFromLatLng(latitude,longitude).then(function(res){
            if(res){
                setAddressFromLatLng(res)
            }
        })        
        map.setCenter([longitude,latitude])
        map.setZoom(15)
    }

    pos = [latitude,longitude]
})

var loaded = false;
$(window).on('hashchange', function(){
    var to = 0;
    if(!loaded) to = 5000;
    setTimeout(function(){
        var $t = $(location.hash)
        loaded = true;
        if(location.hash && location.hash != '#'){
            if($t.length){
                //console.log("setPos: " +$t.attr('lat')+":"+$t.attr('lng')+" z:"+$t.attr('zoom'))
                setPos($t.attr('lat'),$t.attr('lng'),$t.attr('zoom'))
            } else {
                alert("El dispositivo " + location.hash + " dejó de transmitir")
            }
        }
    },to)
}).trigger('hashchange')