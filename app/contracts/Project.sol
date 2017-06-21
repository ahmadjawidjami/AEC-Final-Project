pragma solidity ^0.4.4;

/*
* Project Smart Contract
*
* - Receive Ether from anonymous Backers
* - Update the funding status of the project
* - Show funding status of the project 
* - Kill the project and redistribute the funds (only Creator)
* - Withdraw funds (only Creator)
* - Retrive a share (only Backer)
*
* Notes: 
* The ether cost of each token should be calculated based on the numebr of tokens you are putting up for sale and
* depends on the iniital token supply. Es: goal= 350 initialSupply= 10 partOnSale= 5, then price= 350/5= 70 
*/

// Useful links
// Check this link: https://www.ethereum.org/crowdsale
// Web3 examples https://github.com/fivedogit/solidity-baby-steps/blob/master/contracts/30_endowment_retriever.sol
// Tokens: https://www.ethereum.org/token

// TODO 
// Decide if convert to wei in the blockchain or in web3 

contract ShareToken { function transfer(address receiver, uint amount){  } }

contract Project {
    // State parameters
    address owner; 
    string public title; 
    string public description; 
    uint public fundingGoal; 
    uint public fundingStatus; 
    bool private goalReached; 
    bool private withdrawn; 
    ShareToken public token; 
    uint public price;
    
    // Utility struct
    struct Backer {
        uint amount;  
        bool exists; 
    }

    // Support array used to iterate over the mapping 
    address[] iterator;
    // Map of backers and amounts 
    mapping(address => Backer) fundings; 
    
    modifier onlyOwner() {
        if (msg.sender == owner) _;
    }

    // Constructor
    function Project(string _title, string _description, uint _fundingGoal, uint _etherValueOfToken, ShareToken _tokenAdress) {
        owner = msg.sender;
        title = _title; 
        description = _description; 
        fundingGoal = _fundingGoal * 1 ether; 
        price = _etherValueOfToken * 1 ether;
        token = ShareToken(_tokenAdress);
    }

    // Set all the parameters
    function setParams(string _title, string _description, uint _fundingGoal) {
        title = _title; 
        description = _description; 
        fundingGoal = _fundingGoal; 
    }

    // Shows the status of the project
    function showStatus() constant returns(uint, bool){
        return(fundingStatus, goalReached);
    }

    // Withdraw funds
    function withdraw(uint _amount) onlyOwner {
        assert(goalReached);
        // Get the funds 
        if (_amount <= fundingStatus) {
            withdrawn = true; 
            fundingStatus -= _amount; 
            if( owner.send(_amount) ) {
                WithdrawnFunds(true, fundingStatus); // return the fundingStatus after the withdraw
            } else {
                throw; 
            }
        } else {
            throw; 
        }
         
    }

    // Evaulate whether it is necessary
    function reclaimToken() returns(bool){
        return false; 
    }

    // Contract killer
    function kill() onlyOwner {

        // Give back the money to all the backers 
        for (uint i=0; i< iterator.length; i++) {
            address key = iterator[i]; 
            key.send(fundings[key].amount);
        }
        selfdestruct(msg.sender);
    }

    // Fallback function (send money)
    function() payable {

        uint amount = msg.value; 
        address sender = msg.sender; 
        
        if (fundings[sender].exists) {
            fundings[sender].amount += amount; 
        } else {
            fundings[sender] = Backer(amount, true);
            iterator.push(sender); 
        }
        
        fundingStatus += amount; 
        goalReached = (fundingStatus >= fundingGoal) && (fundingGoal > 0); 
        // give the token to the backer 
        token.transfer(sender, amount / price);
        SomeoneBacked(sender, amount, goalReached);
    }

    // Events
    event SomeoneBacked(address backer, uint amount, bool goalReached);
    event WithdrawnFunds(bool successful, uint fundsLeft);
}
