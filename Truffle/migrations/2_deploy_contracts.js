var CharacterEveryDay = artifacts.require("CharacterEveryDay");

module.exports = function(deployer) {
  deployer.deploy(CharacterEveryDay, "H".charCodeAt(0));
};