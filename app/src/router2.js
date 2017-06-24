const Database = require("./database");

//var projects = jsonfile.readFileSync(path.resolve(__dirname, config.projectsFile));

// TODO: move it in API v2 
const CreatorDB = new Database(require('../models/creators'));
const BackerDB = new Database(require('../models/backers'));


module.exports = (app, web3) => {

    // Controllers 
    let deployer = require("./deploy")(web3);
    //var interactor = require("./interaction")(web3);
    let interactor = require("./interaction2")(web3);

    console.info("API running...");

    // Get Hello World
    app.get('/api/v1/', function(req, res, next) {
        logRequest(req);
        // TODO: write your names! 
        res.send("Hello, this is group E (Boiani, Sibani, Stojkovski, Vilén [MISSING NAMES])!\n");
    });

    // TODO: Change route
    app.post('/api/v1/projects', function(req, res, next) {
        logRequest(req);

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
                token: "todo...",
                duration: 10, //minutes
                price: 2,
                creator: web3.eth.accounts[0]
            }
        }

        Promise.all([deployer.createToken(request.token), deployer.createProject(request.project)])

        deployer
            .createToken(request.token)
            .then(result => {

                // set the token address inside the project 
                request.project.token = result.address;
                console.log(`Token ${result.address} created in ${result.time} seconds`);
                // create the project and add a promise to the chain
                return deployer.createProject(request.project);
            })
            .then(result => {

                console.log(`Inserting ${request.project.title} into ${result.creator} projects list`);
                //write to mongoDB
                let query = {
                    $push: {
                        "projects": {
                            address: result.address, // project contract address
                            token: request.project.token, // token contract address
                            deadline: new Date().setTime(new Date().getTime() + (request.project.duration * 60 * 1000))
                        }
                    }
                }

                // TODO: change the promise: http://mongoosejs.com/docs/promises.html
                CreatorDB
                    .update(result.creator, query)
                    .then(result => console.log(result))
                    .catch(error => console.log(error));

                var r = `Project ${request.project.title} with address ${result.address} created in ${result.time} seconds\n`;
                res.send(r);

            })
            .catch(error => res.send(error))
            .catch(error => res.send(error));
    });

    // Fund a project 
    // TODO: change mongo call in API v2 
    app.post('/api/v1/projects/fund', function(req, res, next) {

        logRequest(req);

        let funding = req.body;

        interactor
            .fundProject(funding)
            .then(result => {
                let backer = req.body.backer;
                let query = { $push: { "projects": { address: funding.project } } };

                // write on db
                // TODO: change the promise: http://mongoosejs.com/docs/promises.html
                CreatorDB
                    .update(backer, query)
                    .then(result => console.log(result))
                    .catch(error => console.log(error));

                res.send(result);
            })
            .catch(error => {
                console.log(error);
                res.send(error);
            });
    });

    // Get all projects
    app.get('/api/v1/projects', function(req, res, next) {
        logRequest(req);
        // TODO: must be implemented

        // example...
        CreatorDB
            .getAll()
            .then(result => res.send(result))
            .catch(error => res.send(error));

    });

    // Get all projects created by a creator
    app.get('/api/v1/projects/creator/:creator', function(req, res, next) {
        logRequest(req);
        // TODO: must be implemented
    });

    // Get all projects funded by a backer
    app.get('/api/v1/projects/backer/:backer', function(req, res, next) {
        logRequest(req);
        // TODO: must be implemented
    });

    //Show project status 
    app.get('/api/v1/projects/status/:project', function(req, res, next) {

        logRequest(req);
        let data = req.params;
        interactor
            .showStatus(data)
            .then(result => {
                console.log(result);
                res.send(result);
            })
            .catch(error => {
                console.log(error);
                res.send(error);
            });

    });

    //Show project information
    app.get('/api/v1/projects/:project', function(req, res, next) {
        logRequest(req);
        let data = req.params;

        interactor
            .getProject(data)
            .then(result => res.send(result))
            .catch(error => res.send(error));
    });

    // Log utility
    let logRequest = req => {
        console.log(req.method + " on " + req.originalUrl);
    }

}