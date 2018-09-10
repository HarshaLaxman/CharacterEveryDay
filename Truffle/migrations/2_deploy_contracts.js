var storyContract = artifacts.require("CharacterVoteDays");

module.exports = function(deployer) {
  deployer.deploy(storyContract, 'H'.charCodeAt(0));
};