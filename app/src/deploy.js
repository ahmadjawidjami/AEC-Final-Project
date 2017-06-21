var Web3 = require('web3');
var jsonfile = require('jsonfile');
var contractData = require("../build/contracts/Project.json");
var config = jsonfile.readFileSync(process.cwd() + "\\config.json");
//var config = require("./config");
var web3 = new Web3(new Web3.providers.HttpProvider(config.client));

// Unlock the account
let unlockAccount = () => {
    console.log(`Unlocking account ${config.sender}...`);
    web3.personal.unlockAccount(config.sender, config.password); // supermario
}

let deployContract = (data, callback) => {
    var projectContract = web3.eth.contract(contractData.abi);
    //console.log(data);
    if (data.creator && data.password) {
        // save the data in the config file
        config.sender = data.creator;
        config.password = data.password;
        jsonfile.writeFileSync(process.cwd() + "\\config.json", config);
    } else {
        console.log("No wallet specified, using the latest created");
    }
    web3.eth.defaultAccount = config.sender;
    web3.personal.coinbase = config.sender;
    // unlock the account to call functions
    unlockAccount();

    // start a timer
    var time1 = Date.now();
    var time2 = null;

    // deploy the contract
    console.log(`Start deploying project ${data.title}...`);
    var project = projectContract.new(data.title, data.description, web3.toWei(data.fundingGoal, "ether"), {
        from: web3.eth.defaultAccount,
        data: contractData.unlinked_binary,
        gas: '4700000'
    }, function(e, c) {
        // console.log(e, c);
        if (e)
            callback(e, undefined);

        if (typeof c.address !== 'undefined') {
            //console.log('Contract mined! address:' + c.address);
            time2 = Date.now();
            //console.log(`Contract deployed in ${(time2 - time1) / 1000} seconds`);
            config.projectAddress = c.address;
            jsonfile.writeFileSync(process.cwd() + "\config.json", config);
            var result = {
                address: c.address,
                time: (time2 - time1) / 1000,
                instance: c
            }
            callback(undefined, result)
        }
    });
}

// Export the function
module.exports = {
    deployContract: deployContract
}