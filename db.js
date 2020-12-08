
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
        console.log(result);
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
    return postgrePool.query("SELECT * FROM nerabypaces.reviews WHERE placeid = $1;",[id])
    .then(result => {
        console.log(result);
        if (result.rows) {
            return result.rows;
        } else {
            throw Error('The imgae data could not be found in the database.');
        }
    });

}

module.exports = { getPlaces , getReviews }

