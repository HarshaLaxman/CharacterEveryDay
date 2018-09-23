// var storyContract = artifacts.require("CharacterEveryDay");
// var storyContract = artifacts.require("CharacterVoteDays");
var storyContract = artifacts.require("WordEvents");

module.exports = function(deployer) {
  // deployer.deploy(storyContract, 'H'.charCodeAt(0));
  // deployer.deploy(storyContract, 'H'.charCodeAt(0));
  deployer.deploy(storyContract);
};