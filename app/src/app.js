'use strict';

// 3rd-party dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// models 

//const router = express.Router();
// Application config
const LOCAL_APP_PORT = 8080;
const PUBLIC_APP_PORT = process.env.PUBLIC_APP_PORT || LOCAL_APP_PORT;

// Express middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// import the router 
require('./router.js')(app);

app.listen(LOCAL_APP_PORT, function() {
    console.log(`App started on port ${LOCAL_APP_PORT}`);
});