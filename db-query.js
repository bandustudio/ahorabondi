function fetchNearestCarriers(db, coordinates, callback) {

    db.collection("carriers").createIndex({
        "location": "2dsphere"
    }, function() {
        db.collection("carriers").find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    },
                    $maxDistance: 20000
                }
            }
        }).toArray(function(err, results) {
            if (err) {
                console.log(err)
            } else {
                callback(results);
            }
        });
    });
}

function fetchCarrierDetails(db, userId, callback) {
    db.collection("carriers").findOne({
        userId: userId
    }, function(err, results) {
        if (err) {
            console.log(err)
        } else {
            callback({
                carrierId: results.userId,
                colorId: results.colorId,
                status: results.status,
                plate: results.plate,
                displayName: results.displayName,
                customMsg: results.customMsg,
                phone: results.phone,
                location: results.location
            });
        }
    });
}

function saveRequest(db, requestId, requestTime, location, userId, status, callback) {
    db.collection("requests").insert({
        "_id": requestId,
        requestTime: requestTime,
        location: location,
        userId: userId,
        status: status
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback(results);
        }
    });
}

function updateRequest(db, issueId, carrierId, status, callback) {
    db.collection("requests").update({
        "_id": issueId
    }, {
        $set: {
            status: status,
            carrierId: carrierId
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback(results)
        }
    });
}

function fetchRequests(db, callback) {
    var collection = db.collection("requests");
    //Using stream to process lots of records
    var stream = collection.find({}, {
        requestTime: 1,
        status: 1,
        location: 1,
        _id: 0
    }).stream();

    var requests = [];

    stream.on("data", function(request) {
        requests.push(request);
    });

    stream.on('end', function() {
        callback(requests);
    });
}

exports.fetchNearestCarriers = fetchNearestCarriers;
exports.fetchCarrierDetails = fetchCarrierDetails;
exports.saveRequest = saveRequest;
exports.updateRequest = updateRequest;
exports.fetchRequests = fetchRequests;