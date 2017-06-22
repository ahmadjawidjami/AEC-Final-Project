var contractData = require("../build/contracts/Project.json");

// Export the function
module.exports = (web3) => {

    // fund project
    // TODO: check if backer has funds
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

    // Get Project info 
    // TODO: check sender of the transaction
    let getProject = (data, callback) => {
        var projectContract = web3.eth.contract(contractData.abi).at(data.project);
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
        projectContract.setParams(data.title, data.description, data.fundingGoal, { from: web3.eth.accounts[0], gas: 400000 },
            (error, result) => {
                callback(error, result);
            });
    }

    let withdrawFunds = (data, callback) => {

    }

    let claimShare = (data, callback) => {

    }

    let kill = (data, callback) => {

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