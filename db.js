
'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const postgreConnectionString =
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

console.log(postgreConnectionString);
const postgrePool = new Pool({
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL : postgreConnectionString,
    ssl: { rejectUnauthorized: false }
});

postgrePool.connect()

function getPlaces(){
        return postgrePool.query("SELECT * FROM nearbyplaces.places")
    .then(result => {
        if (result.rows) {
            return result.rows;
        } else {
            throw Error('The imgae data could not be found in the database.');
        }
    });
}

//this will get the reviews for all the records in the reviews db that have the foreighn
//key placeID that match the pad in id
function getReviews(id){
    return postgrePool.query("SELECT * FROM nearbyplaces.reviews WHERE placeid = $1;",[id])
    .then(result => {
        console.log(result);
        if (result.rows) {
            return result.rows;
        } else {
            throw Error('The imgae data could not be found in the database.');
        }
    });

}

function searchTermLoc(term,loc,type){
    const ation = loc.toUpperCase();
    const command = `SELECT * FROM nearbyplaces.places WHERE keywords LIKE '${term}%' AND UPPER("type") LIKE '${type.toUpperCase()}%' AND UPPER(city) LIKE '${ation}%'`;
    return postgrePool.query(command)
    .then(result => {
        console.log(result);
        if (result.rows) {
            return result.rows;
        } else {
            throw Error('The imgae data could not be found in the database.');
        }
    });


}

function getDetails(id){
    const command = `SELECT * FROM nearbyplaces.places,nearbyplaces.reviews WHERE nearbyplaces.places.id = ${id} 
    AND nearbyplaces.places.id = nearbyplaces.reviews.placeid`
    return postgrePool.query(command)
    .then(result => {
        if(result.rows){
            return result.rows;
        } else{
            throw Error('something happened in detail');
        }
    })
}

function addReview(id,review){
    console.log("FROM THE SERVER:", id,review);
    const command = `INSERT INTO nearbyplaces.reviews (review,score,placeid) VALUES ('${review}',5,${parseInt(id)})`;
    return postgrePool.query(command , (err,res) => {
        console.log("ADDED A REVIEW; CHECK SQL TABLE");
    })

}

function addBusiness(name,type,address,city,state,rating,open,close,keywords){
    const command = `INSERT INTO nearbyplaces.places (name,type,address,city,state,rating,open,close,keywords) 
    VALUES (${name},${type},${address},${city},${state},${rating},${open},${close},${close})`;
    return postgrePool.query(command , (err,res) => {
        console.log("Added a new business");
    })

}

module.exports = { getPlaces , getReviews, searchTermLoc, addReview , getDetails , addBusiness}

