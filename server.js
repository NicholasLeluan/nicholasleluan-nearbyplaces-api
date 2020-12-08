const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const db = require('./db');

const app = express();

const port = process.env.PORT || 3002;

console.log(db);
//Middlewear
app.use(cors()); //allows requests from anywhere to be accepted; this could accept specific IP addresses
app.use(bodyParser.json()); //a request that comes in is converted from byte array to a JSON object
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (request, response) => {
    response.send('Welcome to NearbyPlaces API');
});


//this will be the place to Insert a new place into the places table
// access fields by let place = request.body.variable where variable is the name
// of the input from the frontend 
app.post('/place', (request,response) => {
    response.send('Here is where to post a new place')
});

//Get all the places and their reviews....maybe do a JOIN where you get all the places
// and their associated reviews all in one?
app.get('/places' , (request,response) => {
    db.getPlaces().then(x => response.json(x))
    .catch(e => response.status(500).json({error: 'Quizzes could not be retrieved.'}));
});

//adds in a new review of the ID of the place. Insert this into the reviews table
// the plaid foreign key will be this passed in id
app.post('/review/:placeID', (request, response) => {
    console.log("REVIEW WAS CALLED:::")
    let placeID = request.body.id;
    let review = request.body.review;
    console.log(placeID, review);
    db.addReview(placeID,review)
    .catch(e => response.status(500).json({error: 'SQL query for review was bad'}));

});

//Search within the places table and get any records that match the location (city), and
//match a keyword ---> USE LIKE IN SQL!!
app.get('/search/:searchTerm/:location/:type' , (request, response) => {
    let loc = request.params.location;
    let term = request.params.searchTerm;
    let type = request.params.type;
    if (loc == "void_loc"){
        loc = "";
    }
    if (term == "void_term"){
        term = "";
    }
    if (type == "void_type"){
        type = "";
    }
    db.searchTermLoc(term,loc,type).then(x => response.json(x))
    .catch(e => response.status(500).json({error: `SQL query could not be searched--> location: ${loc}, term: ${term}, type: ${type}`}));

});

app.get('/detail/:placeID' , (request,response) => {
    let placeID = request.params.placeID;
    db.getDetails(placeID).then(x => response.json(x))
    .catch(e => response.status(500).json({error: 'SQL query for detail was bad'}));
})

//continously listening for a request to the above defined port.
app.listen(port, () => {
    console.log("Listening on port "+port);
});