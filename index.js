const express = require( 'express' );
const mongoose = require( 'mongoose' );
const fs = require( 'fs' );
const ObjectId = mongoose.Types.ObjectId;

const app = express();
      app.use( express.json() );
      app.use( express.urlencoded() );

//Haetaan ympäristömuuttujat .env tiedostosta
require( "dotenv" ).config();

//Alustetaan haetut tiedot muuttujiin ja rakennetaan tietokannan URL
var username = process.env.MONGO_USERNAME;
var password = process.env.MONGO_PASSWORD;
var uri = "mongodb+srv://" + username + ":" + password + "@cluster0.ml37p7a.mongodb.net/Forum";

//Yhdistetään tietokantaan
mongoose.connect( uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log( "Connection made..." );

//Luodaan Schema
var Schema  = mongoose.Schema;
const messageSchema = new Schema({
    username : String,
    country : String,
    message : String,
    date : Date
}, {collection : "Messages", versionKey : false});

const Message = mongoose.model( "Message", messageSchema );

//Reitit fronttia varten
app.use( express.static( './public/static/' ));

app.get( '/', function ( req, res ) {
    var contents = fs.readFileSync( './public/index.html', 'utf8');
    res.send( contents );
});

//Kaikkien dokumenttien hakeminen
app.get( '/api/getall', async ( req, res ) => {
    try {
        var messages = await Message.find({});
        var cards = makeCards( messages );
        res.send( cards );
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).send( "Internal server error" );
    }
});

//Tietyn dokumentin haku käyttäjänimen perusteella
app.get( '/api/:username', async ( req, res ) => {
    var username = req.params.username;
    const message = await Message.find({ username });
    console.log( message );
});

/*//Tietyn dokumentin haku ID:n perusteella
app.get( '/api/:id', async ( req, res ) => {
    var id = new ObjectId( req.params.id );
    const message = await Message.findById( id );
    console.log( message );
});*/

//Uuden dokumentin lisääminen
app.post( '/api/add', async ( req, res ) => {
    const date = new Date;
    var content = req.body;

    var newMessage = new Message({
        username : content.username,
        country : content.country,
        message : content.message,
        date : date
    });

    newMessage.save().then(() => {
        console.log( "Tallennettu");
    }).catch( error => {
        console.log( error );
    });

    res.set("location", "/");
    res.status( 301 ).send();
    return;
});

//Tieteyn dokumentin muokkaaminen ID:n perusteella
app.put( '/api/update/:id', async ( req, res ) => {
    var id = new ObjectId( req.params.id );
    const filter = { _id : id };
    const update = req.body;
    
    Message.updateOne( filter, update )
        .then(result => {
            console.log( `Document updated.` );
        }).catch( error => {
            console.log( error );
        });
    
    res.set("location", "/");
    res.status( 200 ).send();
    return;
});

//Tietyn dokumentin poistaminen ID:n perusteella
app.delete( '/api/delete/:id', async ( req, res ) => {
    var id = new ObjectId( req.params.id );
    const filter = { _id : id };

    Message.deleteOne( filter )
        .then( () => {
            console.log( "Document deleted. ");
        }).catch( error => {
            console.log( error );
        });

    res.status( 200 ).send();
    return;
});

app.get( '*', function ( req, res ) {
    res.send( "Can\'t find requested page" );
});

//Funktio
function makeCards( data ) {
    var messages = data;
    var cards = "<div class='row'>";

    for(let i = 0; i < messages.length; i++){  
        var info = messages[i];
        var date = JSON.stringify(info["date"]);
        var pvm = date.substring(1, 10);
        var time = date.substring(12, 20);

        cards += `
        <div class="col-sm-6">
            <div class="card">
                <div class="card-header" id="${info["_id"]}">
                    <p class="commentator text-muted">${info["username"]}, ${info["country"]}</p>
                    <button type="button" class="btn delete text-muted" aria-label="Close"><i class="bi-trash"></i></button>
                    <button type="button" class="btn update text-muted" aria-label="Update"><i class="bi-pencil-square"></i></button>
                </div>
                <div class="card-body">
                    <p class="card-text">${info["message"]}</p>
                </div>
                <div class="card-footer">
                    <p class="mb-2 text-muted"> <span id="updated" class="hidden">updated</span> ${pvm} ${time}</p>
                </div>
            </div>
        </div>`
    }

    cards += '</div>';

    return cards;
}

app.listen(8080);

/*
mongoose.connection.close();
console.log( "...connection closed..." );*/
