var query = require('./db-query');

function initialize(app, db, socket, io) {
    // '/carriers?lat=12.9718915&&lng=77.64115449999997'
    app.get('/carriers', function(req, res) {
        /*
            extract the latitude and longitude info from the request. 
            Then, fetch the nearest carriers using MongoDB's geospatial queries and return it back to the client.
        */
        var latitude = Number(req.query.lat);
        var longitude = Number(req.query.lng);
        query.fetchNearestCarriers(db, [longitude, latitude], function(results) {
            res.json({
                carriers: results
            });
        });
    });

    // '/carriers/info?userId=01'
    app.get('/carriers/info', function(req, res) {
        var userId = req.query.userId //extract userId from quert params
        query.fetchCarrierDetails(db, userId, function(results) {
            res.json({
                carrierDetails: results
            });
        });
    });

    //Listen to a 'request-for-help' event from connected users
    socket.on('request-for-help', function(eventData) {
        /*
            eventData contains userId and location
            1. First save the request details inside a table requests
            2. AFTER saving, fetch nearby carriers from user’s location
            3. Fire a request-for-help event to each of the carrier’s room
        */

        var requestTime = new Date(); //Time of the request

        var ObjectID = require('mongodb').ObjectID;
        var requestId = new ObjectID; //Generate unique ID for the request

        //1. First save the request details inside a table requests.
        //Convert latitude and longitude to [longitude, latitude]
        var location = {
            coordinates: [
                eventData.location.longitude, 
                eventData.location.latitude
            ],
            address: eventData.location.address
        };
        query.saveRequest(db, requestId, requestTime, location, eventData.userId, 'waiting', function(results) {

            //2. AFTER saving, fetch nearby carriers from user’s location
            query.fetchNearestCarriers(db, location.coordinates, function(results) {
                eventData.requestId = requestId;
                //3. After fetching nearest carriers, fire a 'request-for-help' event to each of them
                for (var i = 0; i < results.length; i++) {
                    io.sockets.in(results[i].userId).emit('request-for-help', eventData);
                }
            });
        });
    });

    socket.on('request-accepted', function(eventData) { //Listen to a 'request-accepted' event from connected carriers
        console.log(eventData);
        //Convert string to MongoDb's ObjectId data-type
        var ObjectID = require('mongodb').ObjectID;
        var requestId = new ObjectID(eventData.requestDetails.requestId);

        //Then update the request in the database with the carrier details for given requestId
        query.updateRequest(db, requestId, eventData.carrierDetails.carrierId, 'engaged', function(results) {
            //After updating the request, emit a 'request-accepted' event to the user and send carrier details
            io.sockets.in(eventData.requestDetails.userId).emit('request-accepted', eventData.carrierDetails);
        })

    });

    //Fetch all requests
    app.get('/requests/info', function(req, res) {
        query.fetchRequests(db, function(results) {
            var features = [];
            for (var i = 0; i < results.length; i++) {
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: results[i].location.coordinates
                    },
                    properties: {
                        status: results[i].status,
                        requestTime: results[i].requestTime,
                        address: results[i].location.address
                    }
                })
            }
            var geoJsonData = {
                type: 'FeatureCollection',
                features: features
            }

            res.json(geoJsonData);
        });
    });

}

exports.initialize = initialize;