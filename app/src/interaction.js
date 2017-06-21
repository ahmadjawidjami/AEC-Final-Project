var Web3 = require('web3');
var contractData = require("../build/contracts/Project.json");
var web3 = new Web3(new Web3.providers.HttpProvider());

// fund project
let fundProject = (data, callback) => {

    // event: when someone fund a project it shows the address and the amount backed. 
    var projectContract = web3.eth.contract(contractData.abi).at(data.project);
    var someoneBacked = projectContract.SomeoneBacked({ fromBlock: 0, toBlock: 'latest' });

    web3.eth.sendTransaction({ from: data.backer, to: projectContract.address, value: data.amount, gas: 500000 });

    someoneBacked.watch(function(error, result) {
        someoneBacked.stopWatching();
        callback(error, result);
    });
}

let showStatus = (data, callback) => {
    var projectContract = web3.eth.contract(contractData.abi).at(data.project);
    projectContract.showStatus({ from: web3.eth.accounts[0] }, (error, result) => {
        callback(error, result);
    })

}

module.exports = {
    fundProject: fundProject,
    showStatus: showStatus
}