'use strict';

// 3rd-party dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const jsonfile = require("jsonfile");
const exec = require('child_process').exec;
const config = require("../resources/config");

// web3 dependency 
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider());

// Application config
// Change it with the config file info
const LOCAL_APP_PORT = 8080;
const PUBLIC_APP_PORT = process.env.PUBLIC_APP_PORT || LOCAL_APP_PORT;

// ====== uncomment this when you have docker set up
// const MONGO_HOST = process.env.MONGO_HOST;
// const MONGO_PORT = process.env.MONGO_PORT;

// ====== detete this when docker
const MONGO_HOST = "localhost";
const MONGO_PORT = 27017;

// MongoDB connection
const MONGO_URL = 'mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/dev';
global.db = mongoose.createConnection(MONGO_URL);

// Express middlewares
// parse application/x-www-form-urlencoded
// parse application/json
// parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// check blockchain client
// TODO: delete it when Docker is set up
try {
    if (!web3.net.listening)
        throw false;

} catch (error) {
    console.log(`WARN: No blockchain client listening, started a ${config.client} client`);
    console.log(path.resolve(__dirname, config.script));
    exec(path.resolve(__dirname, config.script), function (error, stdout, stderr) {
        console.log("TestRPC started");
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

// import the router 
// require('./router.js')(app);
require('./router.js')(app, web3);

app.listen(LOCAL_APP_PORT, () => {
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


const Database = require("./database");
const CreatorDB = new Database(require('../models/creators'));
const BackerDB = new Database(require('../models/backers'));

const interactor = require("./interaction")(web3);
let killContract = function (data) {
    interactor.showStatus(data).then(function (result) {
        if (!result.goalReached) {
            //TODO remove the project from mongodb
        //remove the project from array of creator projects
        CreatorDB.updatePull(data).then(result => {

            console.log(result);

        }).catch(error =>{
            console.log(error);
        });

        //remove project reference to backers
        BackerDB.updatePull(data).then(result => {
            console.log(result);

        }).catch(error => {
            console.log(error)
        });

            interactor.kill(data);
        }
    })

}

CreatorDB
    .getAll()
    .then(result => {

        let creators = result;
        for (let i = 0; i < creators.length; i++) {
            let currentCreator = creators[i];

            let creatorProjects = currentCreator.projects;
            // console.log(creatorProjects[0].address)
            //  console.log(creatorProjects)

            for (let index = 0; index < creatorProjects.length; index++) {

                let data = {
                    creator: currentCreator._id,
                    project: creatorProjects[index].address
                }

                // //  console.log(data.project)
                //
                //  console.log(data.project)
                //  interactor.showStatus(data).then(function (result) {
                //   if (!result.goalReached){
                console.log(creatorProjects[index])
                setTimeout(killContract, Date.now(), data);
                //  }
                //  })

            }
        }

        // let promisesArray = [];
        // Promise.all(promisesArray).then(result => {
        // }).catch(error => console.log(error));
    })
    .catch(error => console.log(error));















