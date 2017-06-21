# Exercise 5

- Submission deadline: 15.06.2017 (end of day)

## Theory Question

1. Why is it impossible to call external web service APIs from a Smart Contract?
2. What is the difference between Message Calls and Transactions in Ethereum?
3. What is the difference between UTXO and Account Transaction models?

## Blockchain Programming Task: Blockstarter 3.0

Design and implement a "Project" Smart Contract with similar properties (title, description, funding_status, funding_goal, etc.) as in Blockstarter 1.0 as well as a command line interface for interaction.

### Project Smart Contract

The Project Smart Contract should have the following features:
- Receive Ether from anonymous Backers
- Update the funding status of the project
- Show funding status of the project (e.g., show amount of funding that has been received, if the funding goal has been achieved, etc.)
- Allow the Creator of a Project contract to remove the contract and redistribute the funds to the Backers

### Blockstarter 3.0 Command Line Interface

Build a simple Command Line Interface (CLI) with Node.js that allows users to perform the following features:
- Create new Project
- Show a Project's funding status

**Hint:** You can use this npm module to implement the CLI: https://www.npmjs.com/package/commander

### Components of Blockstarter 3.0

Components of your implementation should include:
- Project Smart Contract
- Command Line Interface Client (with Node.js)
- Connection between Smart Contract and Controller (with web3.js)
