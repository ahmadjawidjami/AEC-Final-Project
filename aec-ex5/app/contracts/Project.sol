pragma solidity ^0.4.4;

/*
The Project Smart Contract should have the following features:

- Receive Ether from anonymous Backers
- Update the funding status of the project
- Show funding status of the project (e.g., show amount of funding that has been received, 
    if the funding goal has been achieved, etc.)
- Allow the Creator of a Project contract to remove the contract and redistribute the funds 
    to the Backers
*/

// Check this link: https://www.ethereum.org/crowdsale

// Web3 examples https://github.com/fivedogit/solidity-baby-steps/blob/master/contracts/30_endowment_retriever.sol
contract Project {
    // State parameters
    address owner; 
    string public title; 
    string public description; 
    uint public fundingGoal; 
    uint public fundingStatus; 
    
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
    function Project(string _title, string _description, uint _fundingGoal) {
        owner = msg.sender;
        title = _title; 
        description = _description; 
        fundingGoal = _fundingGoal; 
    }

    function setParams(string _title, string _description, uint _fundingGoal) {
        title = _title; 
        description = _description; 
        fundingGoal = _fundingGoal; 
    }

    // Shows the status of the project
    // TODO: think of doing a Stats struct public so you can retrieveing with setters
    function showStatus() constant returns(uint, bool){

        bool goalReached = (fundingStatus >= fundingGoal) && (fundingGoal > 0); 
        //AskedForStatus(fundingStatus, goalReached); 
        return(fundingStatus, goalReached);
    }

    // Contract killer
    function kill() onlyOwner {

        // Give back the money to all the backers 
        for(uint i=0; i< iterator.length; i++) {
            address key = iterator[i]; 
            key.transfer(fundings[key].amount);
        }
        suicide(msg.sender);
    }

    // Fallback function (send money)
    function() payable {

        uint amount = msg.value; 
        address sender = msg.sender; 
        
        if(fundings[sender].exists) {
            fundings[sender].amount += amount; 
        } else {
            fundings[sender] = Backer(amount, true);
            iterator.push(sender); 
        }
        
        fundingStatus += amount; 
        SomeoneBacked(sender, amount);
    }

    event SomeoneBacked(address backer, uint amount);
}
