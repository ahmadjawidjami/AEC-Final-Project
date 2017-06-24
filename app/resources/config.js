module.exports = {
    client: "geth", // testrpc
    clientUrl: "http://localhost:8545",
    projectsFile: "../resources/projects.json",
    defaultTokenName: "Shares",
    script: `../resources/${client}.sh`, // testrpc.sh
    account: "",
    pwd: ""
}