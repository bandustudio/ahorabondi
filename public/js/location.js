
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, hidePosition);
    } else { 
        alert("Geolocation is not supported by this browser. Now we trying to get your location through your IP address.");
    }
}

function showPosition(position) {
    pos = {
        lat: parseFloat(position.coords.latitude),
        lng: parseFloat(position.coords.longitude)
    };
}

function hidePosition(position) {
    alert('User denied the access of the position. Now we trying to get your location through your IP address.');
    ipPosition();
}

function ipPosition(){
    $.get("http://ipinfo.io", function (response) {
        var loc = response.loc.split(',');
        pos = {
            lat: parseFloat(loc[0]),
            lng: parseFloat(loc[1])
        };
    }, "jsonp");
}

function acceptJob() {
    console.log("accept!!")
    //On clicking the button, emit a 'request-accepted' event/signal and send relevant info back to server
    socket.emit('request-accepted', {
        requestDetails: requestDetails,
        carrierDetails: carrierDetails
    });
}