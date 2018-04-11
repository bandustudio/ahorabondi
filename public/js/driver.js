var socket = io()
, i = 0
, userId = document.body.getAttribute("data-userId")
, requestDetails = {}
, driverDetails = {}
, map
, marker
, pos = null
, lastpos = null
, acceptJob = function () {
    //On clicking the button, emit a 'request-accepted' event/signal and send relevant info back to server
    socket.emit('request-accepted', {
        requestDetails: requestDetails,
        driverDetails: driverDetails
    });

    H.notif.hide()
}

$(function(){

   //Join a room, roomname is sthe userId itself!
    socket.emit('join', {
        userId: userId
    });

    //First send a GET request using JQuery AJAX and get the driver's details and save it
    $.ajax({
        url: '/drivers/info?userId=' + userId,
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
            $('#dropdownMenuStatus').text(H.driver.isLabelByStatus(driverDetails.status))
            L.mapbox.accessToken = H.mapbox.accessToken;
            //Load the map and set it to a driver's lat-lng
            map = L.mapbox.map('map', 'mapbox.streets');
            map.setView([driverDetails.location.latitude, driverDetails.location.longitude], 15);

            //Display a default marker
            marker = L.marker([driverDetails.location.latitude, driverDetails.location.longitude], {icon:H.icon(driverDetails)}).addTo(map);

            H.geo(function(position) {
                i++
                var latitude = position.coords.latitude
                , longitude = position.coords.longitude

                driverDetails.location.latitude = latitude
                driverDetails.location.longitude = longitude

                //$('.pos').html(latitude + ' ' + longitude + ' (' + i + ')' )
                marker.setLatLng([latitude, longitude]).update()
                map.setView([latitude,longitude], 15)
                socket.emit('location',driverDetails)
            })
        },
        error: function(httpRequest, status, error) {
            console.log(error);
        }
    });

    //Listen for a 'request-for-help' event
    socket.on('request-for-help', function(data) {
        requestDetails = data; //Save request details

        //display user info
        H.notif.set('#nuevoenvio',requestDetails,H.driver)

        //Show user location on the map
        L.marker([requestDetails.location.latitude, requestDetails.location.longitude] , {
            icon: L.icon({
                iconUrl: '/images/user.png',
                iconSize: [50, 50]
            })
        }).addTo(map)
    })
})