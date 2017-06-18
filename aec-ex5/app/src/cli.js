const program = require('commander'),
    pkg = require('../package.json');
var deployer = require('./deploy');
var interactor = require('./interaction');
var prompt = require('prompt');

// Set the config file
// global.config = jsonfile.readFileSync(process.cwd() + "/config.json");
// global.confing.sender = process.env.WALLET_ADDRESS;
// global.confing.password = process.env.WALLET_PWD;
// jsonfile.writeFileSync(process.cwd() + "/config.json", global.config);

// Command definition
program
    .version(pkg.version)
    .command('create-project <title>, <description>, <fundingGoal>')
    .description('Create a project')
    .alias('crpro')
    .alias('pro')
    .action((title, description, fundingGoal) => {

        prompt.start();
        prompt.get(['walletAddress', 'walletPassword'], (err, result) => {
            console.log(`create-project command called with the following: ${title}, ${description}, ${fundingGoal}`);
            var data = {
                creator: result.walletAddress,
                password: result.walletPassword,
                title: title,
                description: description,
                fundingGoal: fundingGoal
            }
            deployer.deployContract(data, (err, res) => {
                if (err)
                    console.log(err);
                console.log(`\nProject @ ${res.address} created in ${res.time} seconds\n`);
            });
        });
    });

program
    .version(pkg.version)
    .command('show <what> [project]')
    .description('get project status')
    .action((what, project) => {
        what = "get" + what.charAt(0).toUpperCase() + what.slice(1);
        var data = {
            address: project
        }
        try {
            interactor[what](data, (err, res) => {
                if (!err)
                    console.log(res);
                else
                    console.log(err);
            });
        } catch (err) {
            if (err instanceof TypeError)
                console.log("Command not found")
            else
                console.log(err);
        }
    });

program
    .version(pkg.version)
    .command('fund <amount> [project]')
    .description('get project status')
    .action((amount, project) => {
        prompt.start();
        prompt.get(['walletAddress', 'walletPassword'], (error, result) => {

            console.log("Funding...");
            var data = {
                sender: result.walletAddress,
                password: result.walletPassword,
                amount: amount,
                project: project
            }

            interactor.fundProject(data, (error, result) => {
                if (!error)
                    console.log(`sender: ${result.args.backer}\n backed: ${result.args.amount} wei\n here: ${result.transactionHash}`);
            });
        });

    });

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();