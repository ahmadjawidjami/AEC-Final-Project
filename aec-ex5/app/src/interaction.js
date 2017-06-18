var Web3 = require('web3');
var jsonfile = require('jsonfile');
//var config = require("./config");
var config = jsonfile.readFileSync(process.cwd() + "\\config.json");
var contractData = require("../build/contracts/Project.json");
var web3 = new Web3(new Web3.providers.HttpProvider(config.client));

// Get the contact
var contract = web3.eth.contract(contractData.abi);
// set the latest cerated project
var projectContract = contract.at(config.projectAddress);
web3.personal.defaultAccount = config.sender;
unlockAccount(config);
// unlock the account
//web3.personal.unlockAccount(web3.personal.defaultAccount, config.password);

// web3.eth.defaultAccount = web3.personal.coinbase;
// var randomAccount = web3.eth.accounts;
// web3.personal.coinbase = web3.personal.listAccounts[0];

// show the balance in coinbase
let showCoinbaseBalance = () => {
    web3.eth.getBalance(web3.personal.coinbase, (err, data) => {
        console.log(web3.fromWei(data, 'ether'));
    });
}

// specify which project are you working on
let setProjectLocation = (location) => {
    projectContract = contract.at(location);
}

// set the caller of the function
let setCallerAddress = (data) => {
    web3.personal.defaultAccount = data.sender;
    unlockAccount(data);
}

// Unlock the account

function unlockAccount(credentials) {
    try { web3.personal.unlockAccount(credentials.sender, credentials.password); }
    catch(err){
    
    }
    
}
// event: when someone fund a project it shows the address and the amount backed. 
var someoneBacked = projectContract.SomeoneBacked({ fromBlock: 0, toBlock: 'latest' });

// get project status 
let showStatus = (data, callback) => {
    if (data.address)
        setProjectLocation(data.address);

    projectContract.showStatus({ from: web3.eth.defaultAccount }, (error, result) => {
        callback(error, result);
    });
}

// get project title
let getTitle = (data, callback) => {
    if (data.address)
        setProjectLocation(data.address);

    projectContract.title((error, result) => {
        callback(error, result);
    });

}

// get project description
let getDesc = (data, callback) => {
    if (data.address)
        setProjectLocation(data.address);

    projectContract.description((error, result) => {
        callback(error, result);
    });
}

// get project funding goal 
let getGoal = (data, callback) => {
    if (data.address)
        setProjectLocation(data.address);

    projectContract.fundingGoal((error, result) => {
        callback(error, result);
    });
}

// get project amount funded
let getFundings = (data, callback) => {
    if (data.address)
        setProjectLocation(data.address);

    projectContract.fundingStatus((error, result) => {
        callback(error, result);
    });
}

// set project parameters 
let setParams = (data, callback) => {
    if (data.caller)
        setCallerAddress(data.caller);
    if (data.project)
        setProjectLocation(data.address);

    projectContract.setParams(data.title, data.description, web3.toWei(data.fundingGoal, "ether"), { from: web3.eth.defaultAccount, gas: 400000 },
        (error, result) => {
            callback(error, result);
        });
}

// fund project
let fundProject = (data, callback) => {
    //console.log(data);
    // if no data caller and project are called the program uses the last one/ the default one
    if (data.sender)
        setCallerAddress(data);
    else
        console.log("No wallet specified, using the default one...");

    if (data.project)
        setProjectLocation(data.project);
    else
        console.log("No project specified, using the last deployed...");

    web3.eth.sendTransaction({ from: web3.personal.defaultAccount, to: projectContract.address, value: web3.toWei(data.amount, "ether"), gas: 500000 });

    someoneBacked.watch(function(error, result) {
        someoneBacked.stopWatching();
        callback(error, result);
    });
}

module.exports = {
    getStatus: showStatus,
    getTitle: getTitle,
    getDesc: getDesc,
    getGoal: getGoal,
    getFundings: getFundings,
    setParams: setParams,
    fundProject: fundProject
}