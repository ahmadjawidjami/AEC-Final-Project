pragma solidity ^0.4.8;

/*
* Token rapresenting a share in the Project
* 
* The token is initialized with an initial supply and it is called when a backer funds the project. 
* The backer receives shares corresponding to the amount funded. 
*
* The token should be initialized before each project, as its address is part of the parameters 
* required for the Project creation. 
*
* The token was taken from Ethereum documentation. 
*/

// TODO, think of using the advanced one. 

contract ProejctShare {
    string public name;
    string public symbol;
    uint8 public decimals;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function ProejctShare(uint256 _initialSupply, string _tokenName, uint8 _decimalUnits, string _tokenSymbol) {
        if (_initialSupply == 0) _initialSupply = 100; 
        balanceOf[msg.sender] = _initialSupply;              // Give the creator all initial tokens
        name = _tokenName;                                   // Set the name for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);
    }
}