var socket = io()
, i = 0
, uuid = document.getElementById('uuid').getAttribute("value")
, requestDetails = {}
, driverDetails = {}
, map
, marker
, paused = 1
, pos = null
, lastpos = null
, startJob = function(){
    H.geo(function(position) {
        if(socket.connected){
            i++
            var latitude = position.coords.latitude
            , longitude = position.coords.longitude

            driverDetails.location.latitude = latitude
            driverDetails.location.longitude = longitude

            $('#pos').html(latitude + '<br>' + longitude + ' (' + i + ')' ).fadeIn().delay(1000).fadeOut()

            marker.setLngLat([longitude,latitude])
            marker.addTo(map)

            $(marker.getElement()).find('span').first().removeClass('pulse').addClass('pulse')
            map.setCenter([longitude,latitude])
            map.setZoom(16)

            socket.emit('location',driverDetails)
        }
    })    
}

$(function(){
    $.ajax({
        url: '/drivers/info?id=' + uuid,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            driverDetails = data.driverDetails;
            driverDetails.location = {
                address: driverDetails.location.address,
                longitude: driverDetails.location.coordinates[0],
                latitude: driverDetails.location.coordinates[1]
            }

            $('#driverDetails').html($.templates("#details").render(driverDetails, H.driver))

            mapboxgl.accessToken = H.mapbox.accessToken
            map = new mapboxgl.Map({
                container: 'map',
                style: H.mapbox.style,
                center: [driverDetails.location.longitude,driverDetails.location.latitude],
                zoom: 15
            })

            var el = document.createElement('div');
            el.innerHTML = H.icon(driverDetails)
            marker = new mapboxgl.Marker(el)
            marker.setLngLat([driverDetails.location.longitude,driverDetails.location.latitude])
            marker.addTo(map)

            //setView([driverDetails.location.latitude, driverDetails.location.longitude], 15);

            //Display a default marker
            //marker = L.marker([driverDetails.location.latitude, driverDetails.location.longitude], {icon:H.icon(driverDetails)}).addTo(map);
        },
        error: function(httpRequest, status, error) {
            console.log(error);
        }
    });
})

$(document).on('click','.emit-btn', function(){
    if(!$(this).hasClass('is-danger')){
        if(!socket.connected){
            socket.connect()     
        }
        paused = 0
        $('#map').removeClass('disabled')
        $('#pos').html("Conectando...")
        $(this).removeClass('is-success').addClass('is-danger').html('Detener')  
        socket.emit('join', {uuid: uuid})
        startJob()
        $('.sharetools').show()
    } else {
        paused = 1
        $('#pos').html("Desconectado")
        $('#map').addClass('disabled')
        $(this).removeClass('is-danger').addClass('is-success').html('Compartir ubicación')
        socket.emit('forcedisconnect', {uuid: uuid})
        $('.sharetools').hide()
    }
})    

window.onbeforeunload = function () {
    return "Estás seguro que querés dejar de compartir ubicación?";
};

window.onunload = function () {
    paused = 1
    socket.emit('forcedisconnect', {uuid: uuid})
};