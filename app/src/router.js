var path = require("path");
var jsonfile = require("jsonfile");
const exec = require('child_process').exec;
var config = require("../resources/config");
var projects = jsonfile.readFileSync(path.resolve(__dirname, config.projectsFile));
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider());

// TODO: delete it when Docker is set up
try {
    if (!web3.net.listening)
        throw false;

} catch (error) {
    console.log("No blockchain client listening");
    exec(path.resolve(__dirname, config.script),
        function(error, stdout, stderr) {
            console.log("TestRPC started");
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
}

// Controllers 
var deployer = require("./deploy")(web3);
var interactor = require("./interaction")(web3);

// TODO: move it in API v2 
const Creator = require('../models/creators');
const Backer = require('../models/backers');

module.exports = (app) => {
    console.info("API running...");

    // Get Hello World
    app.get('/api/v1/', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);
        res.send("Hello, this is group E (Boiani, Sibani, Stojkovski, Vilén, [Other Group])!\n");
    });

    // TODO: Change route
    app.post('/api/v1/projects', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);

        // Mockup request
        let request = {
            token: {
                initialSupply: 10,
                tokenName: "Test Token",
                tokenSymbol: "PS",
                decimals: 4,
                creator: web3.eth.accounts[0]
            },
            project: {
                title: "Test Title",
                description: "Frist Project With Token",
                goal: 10,
                duration: 10, //minutes
                price: 2,
                creator: web3.eth.accounts[0]
            }
        }

        deployer.createToken(request.token, (error, result) => {
            request.project.token = result.address;
            console.log(`Token created in ${result.time} seconds`)
            deployer.createProject(request.project, (error, result) => {

                // write to a JSON file
                // projects.list.push({ project: result.address, token: project.token });
                // jsonfile.writeFileSync(path.resolve(__dirname, config.projectsFile), projects);

                console.log(`Inserting ${reques.project.title} into ${result.creator} projects list`);
                //write to mongoDB
                Creator.findByIdAndUpdate(
                    result.creator, { $push: { "projects": { address: result.address, token: project.token, deadline: new Date().setTime(new Date().getTime() + (request.project.duration * 60 * 1000)) } } }, { safe: true, upsert: true },
                    function(err, model) {
                        console.log(err);
                        console.log(model);
                    }
                );

                var r = `Project ${request.project.title} with address ${result.address} created in ${result.time} seconds\n`;
                console.log(r);
                res.send(r);
            });
        });
    });


    // Fund a project 
    // TODO: change mongo call in API v2 
    app.post('/api/v1/projects/fund', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);

        interactor.fundProject(req.body, (error, result) => {
            res.send(result);
            Backer.findByIdAndUpdate(
                req.body.backer, { $push: { "projects": { address: req.body.project } } }, { safe: true, upsert: true },
                function(err, model) {
                    console.log(err);
                    console.log(model);
                }

            );
        });

    });

    // Get all projects
    app.get('/api/v1/projects', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);
        // TODO: implement list all
        // interactor.showStatus(req.params, (error, result) => {
        //     res.send(`Goal ${result[0]}, amount raised: ${result[1]}, goalReached: ${result[2]}\n`);
        // });
    });

    // Get all projects created by a creator
    app.get('/api/v1/projects/creator/:creator', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);
        // TODO: implement list all
        // interactor.showStatus(req.params, (error, result) => {
        //     res.send(`Goal ${result[0]}, amount raised: ${result[1]}, goalReached: ${result[2]}\n`);
        // });
    });

    // Get all projects funded by a backer
    app.get('/api/v1/projects/backer/:backer', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);
        // TODO: implement list all
        // interactor.showStatus(req.params, (error, result) => {
        //     res.send(`Goal ${result[0]}, amount raised: ${result[1]}, goalReached: ${result[2]}\n`);
        // });
    });

    //Show project status 
    app.get('/api/v1/projects/status/:project', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);

        interactor.showStatus(req.params, (error, result) => {
            res.send(`Goal ${result[0]}, amount raised: ${result[1]}, goalReached: ${result[2]}\n`);
        });

    });

    //Show project informations 
    app.get('/api/v1/projects/:project', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);

        interactor.getProject(req.params, (error, result) => {
            if (!error)
                res.send(result);
            else
                res.send(error);
        });
    });


}