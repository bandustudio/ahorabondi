var http = require("http")
var path = require('path')
var express = require("express")
var consolidate = require("consolidate")
var _ = require("underscore")
var bodyParser = require('body-parser')
var routes = require('./routes')
var mongoClient = require("mongodb").MongoClient
var app = express()
var expressLayouts = require('express-ejs-layouts');
const JWT = require('simple-jwt')
const locals = {
    title: "AhoraBondi",
    text: "AhoraBondi es una red voluntaria de visualización de transporte público en tiempo real."
}

/*
app.use(bodyParser.urlencoded({
    extended: true,
}))

app.use(bodyParser.json({
    limit: '5mb'
}))
*/

//app.set('views', 'views') //Set the folder-name from where you serve the html page. 
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('./static')) //setting the folder name (public) where all the static files like css, js, images etc are made available
//app.set('view engine', 'html')
app.set('view engine', 'ejs')
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

app.use(expressLayouts);

//app.engine('html', consolidate.underscore) //Use underscore to parse templates when we do res.render

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
    console.log('Server listening at http://localhost:' + portNumber)

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
            console.log("/");
            res.locals = locals
            res.locals.path = req.path;               
            res.render('index')
        });

        app.post('/log', function(req, res) {
            console.log("/log")
            res.locals = locals
            res.locals.path = req.path;            
            res.render('log', {
                userId: req.query.userId
            });
        });

        app.get('/mapa', function(req, res) { //a request to /user will render our user page
            console.log("/mapa")
            res.locals = locals
            res.locals.path = req.path;
            res.render('mapa', { layout: 'fullscreen' });
        });

        app.get('/emitir/:id', function(req, res) {
            console.log("/emitir/" + req.params.id);
            res.locals = locals
            res.locals.path = req.path;
            res.render('emisor', {
                layout: 'fullscreen',
                userId: req.params.id
            });
        });

        app.get('/data', function(req, res) {
            console.log("/data")
            res.locals = locals
            res.locals.path = req.path;
            res.render('data', { layout: 'fullscreen' });
        });

        app.get('/quiero-participar', function(req, res) {
            console.log("/quiero-participar");
            res.locals = locals
            res.locals.path = req.path;            
            res.render('quiero-participar');
        });

        app.get('/quienes-somos', function(req, res) {
            console.log("/quienes-somos");
            res.locals = locals
            res.locals.path = req.path;            
            res.render('quienes-somos');
        });

        app.post('/signin', function(req, res) {
            console.log("/signin");
            res.locals = locals
            res.locals.path = req.path;            
            res.render('quienes-somos');
        });

        app.post('/signup', function(req, res) {
            console.log("/signup");
            res.locals = locals
            res.locals.path = req.path;            
            res.render('quienes-somos');
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