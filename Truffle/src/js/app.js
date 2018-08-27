App = {
  web3Provider: null,
  contracts: {},
  winningCharacter: "",
  day: null,


  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache...MetaMask error messages suck so this can be useful
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('CharacterEveryDay.json', function(data) {
      console.log(data);
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var CharacterEveryDayArtifact = data;
      App.contracts.CED = TruffleContract(CharacterEveryDayArtifact);

      // Set the provider for our contract
      App.contracts.CED.setProvider(App.web3Provider);

      // did it work?
      console.log(App.contracts.CED);
      var cEDInstance;
      
      App.getDataCED();
     })
  },

  getDataCED: async function() {
    let instance = await App.contracts.CED.deployed();
    console.log("instance: " , instance);

    App.winningCharacter = await instance.winningCharacter().valueOf();
    console.log("winningCharacter: " + App.winningCharacter);

    App.day = await instance.day().valueOf();
    console.log("day: " + App.day);

    App.winningCharacterVotes = await instance.winningCharacterVotes().valueOf();
    console.log("winningCharacterVotes: " + App.winningCharacterVotes);

    App.characterVotes = await instance.getCharacterVotes.call();
    console.log("characterVotes: " + App. characterVotes);
  }
}

$(function() {
    App.initWeb3();
});

