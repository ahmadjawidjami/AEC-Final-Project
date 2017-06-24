module.exports = {
    client: "testrpc", // geth
    clientUrl: "http://localhost:8545",
    projectsFile: "../resources/projects.json",
    defaultTokenName: "Shares",
    script: `../resources/${client}.sh`, // geth.sh   
    account: "",
    pwd: ""
}