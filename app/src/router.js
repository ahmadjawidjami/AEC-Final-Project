var path = require("path");
var jsonfile = require("jsonfile");
const exec = require('child_process').exec;
var config = require("../resources/config");
console.log(__dirname);
console.log(path.resolve(__dirname, config.projectsFile));
// console.log(process.env);
var projects = jsonfile.readFileSync(path.resolve(__dirname, config.projectsFile));
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider());

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


var deployer = require("./deploy")(web3);
var interactor = require("./interaction")(web3);

module.exports = (app) => {
    console.info("API running...");
    // Get Hello World
    app.get('/api/v1/', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);
        res.send("Hello, this is group E (Boiani, Sibani, Stojkovski, Vilén, [Other Group])!\n");
    });

    // TODO: Change route
    app.get('/api/v1/deploy', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);

        var token = {
            initialSupply: 10,
            tokenName: "Test Token",
            tokenSymbol: "PS",
            decimals: 4
        }

        var project = {
            title: "Test Title",
            description: "Frist Project With Token",
            goal: 10,
            price: 2,
            token: "todo..."
        }

        deployer.createToken(token, (error, result) => {
            project.token = result.address;
            console.log(`Token created in ${result.time} seconds`)
            deployer.deployContract(project, (error, result) => {

                projects.list.push({ project: result.address, token: project.token });
                jsonfile.writeFileSync(path.resolve(__dirname, config.projectsFile), projects);
                var r = `Project ${project.title} with address ${result.address} created in ${result.time} seconds\n`;
                console.log(r);
                res.send(r);
            });
        });
    });

    // Fund a project 
    app.post('/api/v1/fund', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);
        interactor.fundProject(req.body, (error, result) => {
            res.send(result);
        });

    });

    //Show project status 
    app.get('/api/v1/status/:project', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);

        interactor.showStatus(req.params, (error, result) => {
            res.send(`Goal ${result[0]}, amount raised: ${result[1]}, goalReached: ${result[2]}\n`);
        });

    });
}