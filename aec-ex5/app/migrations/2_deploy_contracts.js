var Migrations = artifacts.require("Migrations");
var Project = artifacts.require("Project");
var Projects = artifacts.require("Projects");


module.exports = function(deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(Project).then(function(instance) {
        console.log(instance);
    });
    deployer.deploy(Projects).then(function(instance) {
        console.log(instance);
    });

};