const Database = require("./database");

//var projects = jsonfile.readFileSync(path.resolve(__dirname, config.projectsFile));

// TODO: move it in API v2
const CreatorDB = new Database(require('../models/creators'));
const BackerDB = new Database(require('../models/backers'));


module.exports = (app, web3) => {

    // Controllers
    let deployer = require("./deploy")(web3);
    let interactor = require("./interaction")(web3);
    let scheduler = require("./scheduler")(interactor, CreatorDB, BackerDB);

    console.info("API running...");


    app.get('/', function(req, res) {
        var initialState = {
            items: [
                'document your code',
                'drop the kids off at the pool',
                '</script><script>alert(666)</script>'
            ],
            text: ''
        };
        res.render('Html', { data: initialState });
    });

    // Get Hello World
    app.get('/api/v1/', function(req, res, next) {
        logRequest(req);
        res.send("Hello, this is group E (Boiani, Sibani, Stojkovski, Vilén, Jamiulahmadi, Akhlaqi, Ayobi, Sajid)!\n");
    });

    // TODO: Change route
    app.post('/api/v1/projects', function(req, res, next) {
        logRequest(req);
        let request = req.body;

        request = {
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
                duration: 0.1, //minutes
                price: 2,
                creator: web3.eth.accounts[0]
            }
        }

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
                let deadline = new Date().setTime(new Date().getTime() + (request.project.duration * 60 * 1000));
                //write to mongoDB
                let query = {
                    $push: {
                        "projects": {
                            address: result.address, // project contract address
                            token: request.project.token, // token contract address
                            deadline: deadline
                        }
                    }
                }

                // TODO: change the promise: http://mongoosejs.com/docs/promises.html
                CreatorDB
                    .update(result.creator, query)
                    .then(result => console.log(`resultssss: ${result}`))
                    .catch(error => console.log(error));

                let data = {
                    creator: result.creator,
                    project: result.address
                };
                var r = `Project ${request.project.title} with address ${result.address} created in ${result.time} seconds\n`;
                let s = scheduler.setScheduler({ deadline: deadline }, data);
                console.log("asdfasdf");
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
                BackerDB
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
        console.log("PPP");
        // example...
        CreatorDB
            .getAll([{ $unwind: "$projects" }, {
                $project: { _id: 0, address: "$projects.address" }
            }])
            .then(result => {
                return interactor.getAllProjects(result);
            })
            .then(result => res.send(result))
            .catch(error => res.send(error));


    });

    // Get all projects created by a creator
    app.get('/api/v1/projects/creator/:creator', function(req, res, next) {
        logRequest(req);
        let query = { _id: req.params.creator }
        CreatorDB
            .getProjectsByAddress(query)
            .then(result => {

                let projects = result[0].projects;
                let promisesArray = [];

                projects.forEach((value, index) => {
                    promisesArray.push(interactor.showStatus(value));
                });

                Promise.all(promisesArray).then(result => {

                    console.log(result);
                    res.send(result);

                }).catch(error => console.log(error));
            })
            .catch(error => res.send(error));
    });

    // Get all projects funded by a backer
    app.get('/api/v1/projects/backer/:backer', function(req, res, next) {
        logRequest(req);
        let query = { _id: req.params.backer }

        BackerDB.getProjectsByAddress(query).then(
                result => res.send(result))
            .catch(error => res.send(error));
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