var socket = io()
, i = 0
, userId = document.body.getAttribute("data-userId")
, requestDetails = {}
, carrierDetails = {}
, map
, marker
, pos = null
, lastpos = null
, acceptJob = function () {
    //On clicking the button, emit a 'request-accepted' event/signal and send relevant info back to server
    socket.emit('request-accepted', {
        requestDetails: requestDetails,
        carrierDetails: carrierDetails
    });

    $("#notification").fadeOut('fast')
}

$(function(){

   //Join a room, roomname is the userId itself!
    socket.emit('join', {
        userId: userId
    });

    //First send a GET request using JQuery AJAX and get the carrier's details and save it
    $.ajax({
        url: '/carriers/info?userId=' + userId,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            
            carrierDetails = data.carrierDetails;
            carrierDetails.location = {
                address: carrierDetails.location.address,
                longitude: carrierDetails.location.coordinates[0],
                latitude: carrierDetails.location.coordinates[1]
            }

            $('#carrierDetails').html($.templates("#details").render(carrierDetails, H.carrier))
            
            L.mapbox.accessToken = 'pk.eyJ1IjoibWFydGluZnJlZSIsImEiOiJ5ZFd0U19vIn0.Z7WBxuf0QKPrdzv2o6Mx6A';
            //Load the map and set it to a carrier's lat-lng
            map = L.mapbox.map('map', 'mapbox.streets');
            map.setView([carrierDetails.location.latitude, carrierDetails.location.longitude], 15);

            //Display a default marker
            marker = L.marker([carrierDetails.location.latitude, carrierDetails.location.longitude], {icon:H.icon(carrierDetails)}).addTo(map);


            H.geo(function(position) {
                i++
                var latitude = position.coords.latitude
                , longitude = position.coords.longitude

                carrierDetails.location.latitude = latitude
                carrierDetails.location.longitude = longitude


                $('.pos').html(latitude + ' ' + longitude + ' (' + i + ')' )
                marker.setLatLng([latitude, longitude]).update()
                map.setView([latitude,longitude], 15)
                socket.emit('location',carrierDetails)
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
        $('#notification').html($.templates("#nuevoenvio").render(requestDetails, H.carrier)).fadeIn(600)

        //Show user location on the map
        L.marker([requestDetails.location.latitude, requestDetails.location.longitude] , {
            icon: L.icon({
                iconUrl: '/images/user.png',
                iconSize: [50, 50]
            })
        }).addTo(map)

        //$('form, form *').removeClass("hidden-lg-down").fadeIn('slow')
    });
})