const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const db = require('./db');

const app = express();

const port = process.env.PORT || 3002;


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
})

//Get all the places and their reviews....maybe do a JOIN where you get all the places
// and their associated reviews all in one?
app.get('/places' , (request,response) => {
    response.send('Here is where we get all the places and the reviews for each place')

})

//adds in a new review of the ID of the place. Insert this into the reviews table
// the placeid foreign key will be this passed in id
app.post('/review/:placeID', (request, response) => {
    response.send('Here is where we add a review for a passed in place')

})

//Search within the places table and get any records that match the location (city), and
//match a keyword ---> can you do a contain??
app.get('/search/:searchTerm/:location' , (request, response) => {
    response.send('Here is where we get the place based on the given location and searchTerm')

})