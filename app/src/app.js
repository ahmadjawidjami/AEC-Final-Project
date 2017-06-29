'use strict';

// 3rd-party dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// models 

//const router = express.Router();
// Application config
const LOCAL_APP_PORT = 8080;
const PUBLIC_APP_PORT = process.env.PUBLIC_APP_PORT || LOCAL_APP_PORT;

// ====== uncomment this when you have docker set up
// const MONGO_HOST = process.env.MONGO_HOST;
// const MONGO_PORT = process.env.MONGO_PORT;
// ====== detete this when docker
const MONGO_HOST = "localhost";
const MONGO_PORT = 27017;

// MongoDB connection
const MONGO_URL = 'mongodb://' + MONGO_HOST +  ':' + MONGO_PORT + '/dev';
global.db = mongoose.createConnection(MONGO_URL);

// Express middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// import the router 
require('./router.js')(app);

app.listen(LOCAL_APP_PORT, function() {
    console.log("\n\n\n");
    console.log("   ÛÛÛÛÛÛÛÛÛ                                             ÛÛÛÛÛÛÛÛÛÛ");
    console.log("  ÛÛÛ°°°°°ÛÛÛ                                           °°ÛÛÛ°°°°°Û");
    console.log(" ÛÛÛ     °°°  ÛÛÛÛÛÛÛÛ   ÛÛÛÛÛÛ  ÛÛÛÛÛ ÛÛÛÛ ÛÛÛÛÛÛÛÛ     °ÛÛÛ  Û ° ");
    console.log("°ÛÛÛ         °°ÛÛÛ°°ÛÛÛ ÛÛÛ°°ÛÛÛ°°ÛÛÛ °ÛÛÛ °°ÛÛÛ°°ÛÛÛ    °ÛÛÛÛÛÛ   ");
    console.log("°ÛÛÛ    ÛÛÛÛÛ °ÛÛÛ °°° °ÛÛÛ °ÛÛÛ °ÛÛÛ °ÛÛÛ  °ÛÛÛ °ÛÛÛ    °ÛÛÛ°°Û   ");
    console.log("°°ÛÛÛ  °°ÛÛÛ  °ÛÛÛ     °ÛÛÛ °ÛÛÛ °ÛÛÛ °ÛÛÛ  °ÛÛÛ °ÛÛÛ    °ÛÛÛ °   Û");
    console.log(" °°ÛÛÛÛÛÛÛÛÛ  ÛÛÛÛÛ    °°ÛÛÛÛÛÛ  °°ÛÛÛÛÛÛÛÛ °ÛÛÛÛÛÛÛ     ÛÛÛÛÛÛÛÛÛÛ");
    console.log("  °°°°°°°°°  °°°°°      °°°°°°    °°°°°°°°  °ÛÛÛ°°°     °°°°°°°°°° ");
    console.log("                                            °ÛÛÛ                   ");
    console.log("                                            ÛÛÛÛÛ                  ");
    console.log("\n\n\n");
    console.log(`App started on port ${LOCAL_APP_PORT}`);
});