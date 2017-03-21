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
app.use(express.static('./public')) //setting the folder name (public) where all the static files like css, js, images etc are made available
app.set('view engine', 'html')
app.engine('html', consolidate.underscore) //Use underscore to parse templates when we do res.render

var server = http.Server(app)
, portNumber = 8000
, io = require('socket.io')(server) //Creating a new socket.io instance by passing the HTTP server object

server.listen(portNumber, function() { //Runs the server on port 8000
    console.log('Server listening at port ' + portNumber)

    var url = 'mongodb://localhost:27017/myUberApp' //Db name
    mongoClient.connect(url, function(err, db) { //a connection with the mongodb is established here.
        console.log("Connected to Database")

        app.get('/user.html', function(req, res) { //a request to /user.html will render our user.html page
            //Substitute the variable userId in user.html with the userId value extracted from query params of the request.
            res.render('user.html', {
                userId: req.query.userId
            });
        });

        app.get('/carrier.html', function(req, res) {
            res.render('carrier.html', {
                userId: req.query.userId
            });
        });

        app.get('/data.html', function(req, res) {
            res.render('data.html');
        });

        io.on('connection', function(socket) { //Listen on the 'connection' event for incoming sockets
            console.log('A user just connected')

            socket.on('join', function(data) { //Listen to any join event from connected users
                socket.join(data.userId) //User joins a unique room/channel that's named after the userId 
                console.log("User joined room: " + data.userId)
            });

            routes.initialize(app, db, socket, io) //Pass socket and io objects that we could use at different parts of our app
        });
    });
});

/* 1. Not all the template engines work uniformly with express, hence this library in js, (consolidate), is used to make the template engines work uniformly. Altough it doesn't have any 
modules of its own and any template engine to be used should be seprately installed!*/