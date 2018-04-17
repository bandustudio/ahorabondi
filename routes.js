exports.function(){

app.get('/', function(req, res) {
    console.log("/");
    res.locals = locals
    res.locals.path = req.path;               
    res.render('index',{ uuid : uuid.v4() })
});

app.post('/log', function(req, res) {
    console.log("/log")
    res.locals = locals
    res.locals.path = req.path;            
    res.render('log', {
        uuid: req.query.uuid
    });
});

app.get('/mapa', function(req, res) { //a request to /user will render our user page
    console.log("/mapa")
    res.locals = locals
    res.locals.path = req.path;
    res.render('mapa', { 
        layout: 'fullscreen',
        uuid : uuid.v4()
    });
});

app.get('/emisor/:id', function(req, res) {
    console.log("/emisor/" + req.params.id);
    res.locals = locals
    res.locals.path = req.path;
    res.render('emisor', {
        layout: 'fullscreen',
        uuid: req.params.id
    });
});

app.get('/drivers/info', function(req, res) {
    var id = req.query.id //extract uuid from quert params

    console.log(database.db)

    database.db.collection("drivers").findOneAndUpdate({
        uuid: id
    }, {
        uuid: id,
        colorId:1,
        displayName:"Mi viaje",
        customMsg:"Editar este viaje."
    }, {
        new: true,
        upsert:true
    }, function(err,result) {
        if(err){
            console.log(err)
            console.log("Something wrong when updating data!")
        }
        console.log("...........")
        console.log(id)
        console.log(result)
        res.json({
            driverDetails: result
        })
    })
})

/*
app.get('/info', function(req, res) {
    var uuid = req.query.uuid //extract uuid from quert params

    console.log("info " + uuid);

    return Driver.findOneAndUpdate({
        uuid: uuid
    }, {
        uuid: uuid,
        colorId:1,
        displayName:"Mi Viaje",
        customMsg:"Editar este Viaje."
    }, {
        upsert:true
    }).then(function(result) {

        console.log("...");
        console.log(result);

        if(err){
            console.log(err)
            console.log("Something wrong when updating data!")
        }
        console.log("...........")
        console.log(uuid)
        console.log(result)
        res.json({
            driverDetails: result
        })
    })
})*/

app.get('/data', function(req, res) {
    console.log("/data")
    res.locals = locals
    res.locals.path = req.path;
    res.render('data', { layout: 'fullscreen' });
})

app.get('/quiero-participar', function(req, res) {
    console.log("/quiero-participar");
    res.locals = locals
    res.locals.path = req.path;            
    res.render('quiero-participar',{ uuid : uuid.v4() });
})

app.get('/preguntas-frecuentes', function(req, res) {
    console.log("/preguntas-frecuentes");
    res.locals = locals
    res.locals.path = req.path;            
    res.render('preguntas-frecuentes');
})

app.post('/signin', function(req, res) {
    console.log("/signin");
    res.locals = locals
    res.locals.path = req.path;            
    res.render('preguntas-frecuentes');
})

app.post('/signup', function(req, res) {
    console.log("/signup");
    res.locals = locals
    res.locals.path = req.path;            
    res.render('preguntas-frecuentes');
})