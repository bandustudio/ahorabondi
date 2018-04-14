var http = require("http")
, express = require("express")
, consolidate = require("consolidate")
, _ = require("underscore")
, bodyParser = require('body-parser')
, routes = require('./routes')
, mongoClient = require("mongodb").MongoClient
, app = express()

app.use(bodyParser.urlencoded({
    extended: true,
}))

app.use(bodyParser.json({
    limit: '5mb'
}))

app.set('views', 'views') //Set the folder-name from where you serve the html page. 
app.use(express.static('./static')) //setting the folder name (public) where all the static files like css, js, images etc are made available
app.set('view engine', 'html')
app.engine('html', consolidate.underscore) //Use underscore to parse templates when we do res.render

var server = http.Server(app)
, portNumber = 8000
, io = require('socket.io')(server) //Creating a new socket.io instance by passing the HTTP server object

// Create seed data
var driversData = [
    {
        "userId" : "1",
        "colorId" : 1,
        "displayName" : "Unidad 1 - Ceferino",
        "customMsg" : "",
        "phone" : "01",
        "plate" : "AAA111",
        "email" : "Driver01@gmail.com",
        "status" : "waiting",
        "earnedRatings" : 21,
        "totalRatings" : 25,
        "location" : {
            "type" : "Point",
            "address" : "C1203AAA CABA Av. Rivadavia 2899, Argentina",
            "coordinates" : [
                -58.405758,
                -34.6103905            
            ]
        }
    },{
        "userId" : "2",
        "colorId" : 2,
        "displayName" : "Unidad 2 - Ceferino",
        "customMsg" : "",
        "phone" : "01",
        "plate" : "AAA222",
        "email" : "Driver01@gmail.com",
        "status" : "waiting",
        "earnedRatings" : 21,
        "totalRatings" : 25,
        "location" : {
            "type" : "Point",
            "address" : "C1203AAA CABA Av. Rivadavia 2899, Argentina",
            "coordinates" : [
                -58.405758,
                -34.6103905            
            ]
        }
    }
];

server.listen(portNumber, function() { //Runs the server on port 8000
    console.log('Server listening at port ' + portNumber)

    //var url = 'mongodb://localhost:27017/myUberApp' //Db name
    //var url = 'mongodb://user01:1234@ds241699.mlab.com:41699/ahorabondi'
    var url = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

    mongoClient.connect(url, function(err, db) { //a connection with the mongodb is established here.

        /*
        var drivers = db.collection('drivers');

        console.log("Seeding Database")

        drivers.insert(driversData, function(err, result) {
            if(err) throw err;
            console.log("Database seeded")
        })*/

        console.log("Connected to Database")

        app.get('/', function(req, res) {
            res.render('index.html')
        });

        app.post('/log', function(req, res) {
            res.render('log.html', {
                userId: req.query.userId
            });
        });

        app.get('/mapa', function(req, res) { //a request to /user.html will render our user.html page
            //Substitute the variable userId in user.html with the userId value extracted from query params of the request.
            res.render('mapa.html', {});
        });

        app.get('/emitir/:id', function(req, res) {
            res.render('emisor.html', {
                userId: req.params.id
            });
        });

        app.get('/data', function(req, res) {
            res.render('data.html');
        });

        app.get('/quiero-participar', function(req, res) {
            res.render('quiero-participar.html');
        });


        app.get('/quienes-somos', function(req, res) {
            res.render('quienes-somos.html');
        });

        io.on('connection', function(socket) { //Listen on the 'connection' event for incoming sockets
            console.log('A user just connected')

            socket.on('join', function(data) { //Listen to any join event from connected users
                socket.join("map") //User joins a unique room/channel that's named after the userId 
                console.log("User join")
            });

            socket.on('forcedisconnect', function (data) {
                console.log('User has disconnected.');
                console.log(data);
                io.sockets.emit("disconnect",data)
                socket.disconnect();
            })

            routes.initialize(app, db, socket, io) //Pass socket and io objects that we could use at different parts of our app
        });
    });
});

/* 1. Not all the template engines work uniformly with express, hence this library in js, (consolidate), is used to make the template engines work uniformly. Altough it doesn't have any 
modules of its own and any template engine to be used should be seprately installed!*/