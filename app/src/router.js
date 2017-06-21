var deployer = require("./deploy");
var interactor = require("./interaction");

var fund = {
    backer: "address",
    project: "address",
    amount: "amount"

}

module.exports = (app) => {
    console.info("API running...");
    // Get Hello World
    app.get('/api/v1/', function(req, res, next) {
        console.log(req.method + " on " + req.originalUrl);
        res.send("Hello, this is group S (Boiani, Sibani, Stojkovski, Vilén)!\n");
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
            res.send(`Amount raised: ${result[0]}, goalReached: ${result[1]}\n`);
        });

    });
}