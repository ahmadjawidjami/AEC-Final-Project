var contractData = require("../build/contracts/Project.json");
var tokenData = require("../build/contracts/ProejctShare.json");
// Unlock the account
// let unlockAccount = () => {
//     console.log(`Unlocking account ${web3.eth.accounts[0]}...`);
//     web3.eth.unlockAccount(web3.eth.accounts[0]); // supermario
// }
// unlockAccount();

// Export the function
module.exports = (web3) => {

    let createToken = (data, callback) => {
        var token = web3.eth.contract(tokenData.abi);

        // start a timer
        var time1 = Date.now();
        var time2 = null;

        // deploy the contract
        console.log(`Start creating token ${data.tokenName}...`);
        var shares = token.new(data.initialSupply, data.tokenName, data.decimals, data.tokenSymbol, {
            from: web3.eth.accounts[0],
            data: tokenData.unlinked_binary,
            gas: '4700000'
        }, function(e, c) {
            // console.log(e, c);
            if (e)
                callback(e, undefined);

            if (typeof c.address !== 'undefined') {
                //console.log('Contract mined! address:' + c.address);
                time2 = Date.now();

                var result = {
                    address: c.address,
                    time: (time2 - time1) / 1000,
                    instance: c
                }
                callback(undefined, result)
            }
        });

    }

    let deployContract = (data, callback) => {
        var projectContract = web3.eth.contract(contractData.abi);

        // start a timer
        var time1 = Date.now();
        var time2 = null;

        // deploy the contract
        console.log(`Start deploying project ${data.title}...`);
        var project = projectContract.new(data.title, data.description, data.goal, data.price, data.token, {
            from: web3.eth.accounts[0],
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
                var result = {
                    address: c.address,
                    time: (time2 - time1) / 1000,
                    instance: c
                }
                callback(undefined, result)
            }
        });
    }

    return {
        deployContract: deployContract,
        createToken: createToken
    };
}