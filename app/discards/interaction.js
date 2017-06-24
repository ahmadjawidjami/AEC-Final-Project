var contractData = require("../build/contracts/Project.json");
var contractData = require("../build/contracts/ShareToken.json");

// Export the function
module.exports = (web3) => {

    // fund project
    // TODO: check if backer has funds
    let fundProject = (data, callback) => {

        // event: when someone fund a project it shows the address and the amount backed. 
        var projectContract = getProjectContract(data);
        var someoneBacked = projectContract.SomeoneBacked({ fromBlock: 0, toBlock: 'latest' });

        web3.eth.sendTransaction({ from: data.backer, to: projectContract.address, value: data.amount, gas: 500000 });

        someoneBacked.watch(function(error, result) {
            someoneBacked.stopWatching();
            callback(error, result);
        });
    }

    let showStatus = (data, callback) => {

        var projectContract = getProjectContract(data);
        projectContract.showStatus({ from: web3.eth.accounts[0] }, (error, result) => {
            callback(error, result);
        })

    }

    // Get Project info 
    // TODO: check sender of the transaction
    let getProject = (data, callback) => {

        var projectContract = getProjectContract(data);
        projectContract.getInfo({ from: web3.eth.accounts[0] }, (error, result) => {
            var project;
            console.log(result);
            if (!error) {
                project = {
                    title: result[0],
                    description: result[1],
                    fundingGoal: result[2],
                    fundingStatus: result[3],
                    goalReached: result[4]
                }
            }
            callback(error, project);

        });
    }

    // set project parameters 
    // TODO: check creator
    let setParams = (data, callback) => {

        // get the contract 
        var projectContract = getProjectContract(data);

        // set the contact params 
        projectContract.setParams(data.title, data.description, data.fundingGoal, { from: web3.eth.accounts[0], gas: 400000 },
            (error, result) => {
                callback(error, result);
            });
    }

    let withdrawFunds = (data, callback) => {

        // get the projct
        var projectContract = getProjectContract(data);

        // instanciate the Withdraw event 
        var withdrawnFunds = projectContract.WithdrawnFunds({ fromBlock: 0, toBlock: 'latest' });

        // call the witdraw function on the contract 
        projectContract.withdraw(data.amount, { from: web3.eth.accounts[0], gas: 400000 });

        // wait for the event to happen
        withdrawnFunds.watch(function(error, result) {
            withdrawnFunds.stopWatching();
            callback(error, result);
        });
    }

    let claimShare = (data, callback) => {

        // get the contracts
        var projectContract = getProjectContract(data);
        var tokenContract = getTokenContract(data);

        // instanciate the event 
        var transfer = tokenContract.Transfer({ fromBlock: 0, toBlock: 'latest' });

        // claim the token by giving the backer address
        projectContract.claimShare({ from: data.address, gas: 400000 });

        // wait for Transfer event to happen
        transfer.watch(function(error, result) {
            transfer.stopWatching();
            callback(error, result);
        });

    }

    // TODO: only owner can kill the contract 
    let kill = (data, callback) => {

        var projectContract = getProjectContract(data);
        // it must be the creator
        projectContract.kill({ from: web3.eth.accounts[0], gas: 400000 });
    }

    let getProjectContract = (data) => {
        return web3.eth.contract(contractData.abi).at(data.project);
    }

    // TODO: get token from contract 
    let getTokenContract = (data) => {
        return web3.eth.contract(tokenData.abi).at(data.token);
    }

    return {
        getProject: getProject,
        showStatus: showStatus,
        setParams: setParams,
        fundProject: fundProject,
        withdrawFunds: withdrawFunds,
        claimShare: claimShare,
        kill: kill
    };
}