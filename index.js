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
    Message.find({}).then( messages => {
        console.log( messages );
    }).catch( error => {
        console.log( error );
    });
});

//Tietyn dokumentin haku ID:n perusteella
app.get( '/api/:id', async ( req, res ) => {
    var id = new ObjectId( req.params.id );
    const message = await Message.findById( id );
    console.log( message );

});

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
    res.status(301).send();
    return;
});

//Tieteyn dokumentin muokkaaminen ID:n perusteella
app.put( '/api/update/:id', async ( req, res ) => {
    var id = new ObjectId( req.params.id );
    const filter = { _id : id };
    const update = { message : "moromoro!"}

    Message.updateOne( filter, update )
        .then(result => {
            console.log( `${result.nModified} document updated.` );
        }).catch( error => {
            console.log( error );
        });
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
});

app.get( '*', function ( req, res ) {
    res.send( "Can\'t find requested page" );
});

app.listen(8080);

/*
mongoose.connection.close();
console.log( "...connection closed..." );*/
