var contractData = require("../build/contracts/Project.json");
var tokenData = require("../build/contracts/ShareToken.json");

// Export the function
module.exports = (web3) => {

    // utility functions
    // get the speficied project
    let getProjectContract = (data) => {
        return data.project ?
            web3.eth.contract(contractData.abi).at(data.project) :
            web3.eth.contract(contractData.abi).at(data.address);
    }

    // get the specified token
    let getTokenContract = (data) => {
        return web3.eth.contract(tokenData.abi).at(data.token);
    }

    // fund project
    // TODO: check if backer has funds
    //@ahmad: promise added
    let fundProject = data => {
        return new Promise((resolve, reject) => {
            // event: when someone fund a project it shows the address and the amount backed. 
            let someoneBacked = getProjectContract(data).SomeoneBacked({ fromBlock: 0, toBlock: 'latest' });

            // fund the project
            web3.eth.sendTransaction({ from: data.backer, to: data.project, value: data.amount, gas: 500000 });

            // start watching for the funding event
            someoneBacked.watch((error, result) => {
                if (error) {
                    someoneBacked.stopWatching();
                    reject(error);
                } else {
                    resolve(result);
                }
            });

        });
    }

    // @ahmad: promise added
    // get the status of the project 
    let showStatus = data => {
        return new Promise((resolve, reject) => {
            getProjectContract(data).showStatus({ from: web3.eth.accounts[0] }, (error, result) => {
                if (error)
                    reject(error);
                else {
                    let ret = {
                        projectAddress: data.address,
                        fundingGoal: result[0],
                        fundingStatus: result[1],
                        goalReached: result[2]
                    }
                    resolve(ret);
                }
            });
        });

    }

    // Get Project info 
    // TODO: check sender of the transaction
    // @ahmad: promise added
    let getProject = data => {
        return new Promise((resolve, reject) => {
            getProjectContract(data).getInfo({ from: web3.eth.accounts[0] }, (error, result) => {
                if (error)
                    reject(error);
                else {
                    project = {
                        title: result[0],
                        description: result[1],
                        fundingGoal: result[2],
                        fundingStatus: result[3],
                        finalFundings: result[4],
                        goalReached: result[5],
                        address: data.project || data.address,
                        deadline: data.deadline,
                        token: data.token
                    }
                    resolve(project);
                }

            });
        });
    }

    let getAllProjects = data => {
        let promisesArray = [];

        data.forEach((value, index) => {
            promisesArray.push(getProject(value));
        })

        return Promise.all(promisesArray);

    }

    // set project parameters 
    // TODO: check creator
    // @ahmad: promise added
    let setParams = (data, callback) => {
        return new Promise((resolve, reject) => {
            // set the contact params 
            getProjectContract(data)
                .setParams(data.title, data.description, data.fundingGoal, { from: data.creator, gas: 400000 },
                    (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
        });

    }

    // withdraw funds
    let withdrawFunds = data => {
        return new Promise((resolve, reject) => {
            // instanciate the Withdraw event 
            let withdrawnFunds = getProjectContract(data).WithdrawnFunds({ fromBlock: 0, toBlock: 'latest' });

            // call the witdraw function on the contract 
            getProjectContract(data).withdraw(data.amount, { from: data.creator, gas: 400000 });

            // wait for the event to happen
            withdrawnFunds
                .watch()
                .then(result => {
                    withdrawnFunds.stopWatching();
                    resolve(result)
                })
                .catch(error => { reject(error) });
        });
    }

    let claimShare = data => {
        return new Promise((resolve, reject) => {

            // instanciate the transfer event 
            var transfer = getTokenContract(data).Transfer({ fromBlock: 0, toBlock: 'latest' });

            // claim the token by giving the backer address
            getProjectContract(data).claimShare({ from: data.backer, gas: 400000 });

            // wait for Transfer event to happen
            transfer
                .watch()
                .then(result => {
                    transfer.stopWatching();
                    resolve(result);
                })
                .catch(error => reject(error));
        });
    }

    // TODO: only owner can kill the contract 
    let kill = data => {
        return new Promise((resolve, reject) => {
            // it must be the creator
            getProjectContract(data)
                .kill({ from: data.creator, gas: 400000 }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
        });
    }


    return {
        getAllProjects: getAllProjects,
        getProject: getProject,
        showStatus: showStatus,
        setParams: setParams,
        fundProject: fundProject,
        withdrawFunds: withdrawFunds,
        claimShare: claimShare,
        kill: kill
    };
}