App = {
    web3Provider: null,
    contracts: {},
    day: null,
    instanceCVD: null,
    wordHistory: [],
  
  
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
      $.getJSON('WordEvents.json', function(data) {
        console.log(data);
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var WordEventsArtifact = data;
        App.contracts.WordEvents = TruffleContract(WordEventsArtifact);
  
        // Set the provider for our contract
        App.contracts.WordEvents.setProvider(App.web3Provider);
  
        console.log(App.contracts.WordEvents);
        
        App.getDataWordEvents(App.loadPage);
       })
    },
  
    getDataWordEvents: async function(callback) {
      let instance = await App.contracts.WordEvents.deployed();
      instanceWordEvents = instance;
      console.log("instance: " , instance);
  
    //   App.winningCharacter = await instance.winningCharacter();
    //   console.log("winningCharacter: " + App.winningCharacter);
  
    //   App.day = await instance.day();
    //   console.log("day: " + App.day);
  
    //   App.votesToday = await instance.votesToday();
    //       console.log("votesToday: " + App.votesToday);
  
    //   App.winningCharacterVotes = await instance.winningCharacterVotes();
    //   console.log("winningCharacterVotes: " + App.winningCharacterVotes);
  
    //   App.characterVotes = await instance.getCharacterVotes.call();
    //       console.log("characterVotes: ", App.characterVotes);
          
        events = await instance.allEvents({fromBlock: 0, toBlock: 'latest'});
        await events.get(function(error, logs){
            console.log("logs", logs);
            for (log of logs) {
                let word = String.fromCharCode(log.args._word.valueOf())
                console.log(word);
                App.wordHistory.push(word);
            }
            callback();
        });    
    },
  
    loadPage: function() {
    //   $("#day").append(App.day.valueOf());
    //   $("#votesToday").append(App.votesToday.valueOf());
    //   $("#winningCharacter").append(String.fromCharCode(App.winningCharacter.valueOf()));
    //   $("#winningCharacterVotes").append(App.winningCharacterVotes.valueOf());
  
    //   let characterVotesDict = [];
    //   for (let charCode = 0; charCode < App.characterVotes.length; charCode++) {
    //      let charVotes = {};
    //      let char = String.fromCharCode(charCode);
    //      let votes = App.characterVotes[charCode].valueOf();
    //      if (votes > 0) 
    //       charVotes[char] = votes;       
    //      else 
    //       continue;
    //      characterVotesDict.push(charVotes);
    //   }
    //   characterVotesDict.sort(function(a,b) {
    //     return parseInt(Object.values(b) - parseInt(Object.values(a)))
    //   })
    //   console.log(characterVotesDict);
    //   // document.getElementById('foo').appendChild(makeUL(options[0]));
    //       $("#characterVotes").append(App.makeList(characterVotesDict));	
          
    //       for (char of App.characterHistory) {
    //           console.log("here is" + char);
    //           $("#characterHistory").append(char);
    //       }
    },
  
    makeList: function(arrayObjs) {
      var list = document.createElement('ul');
  
    //   for(var i = 0; i < arrayObjs.length; i++) {
    //       var item = document.createElement('li');
    //       item.appendChild(document.createTextNode(Object.keys(arrayObjs[i])[0] + " : " + Object.values(arrayObjs[i])[0]));
    //       list.appendChild(item);
    //   }
      
      return list;
    },
  
    vote: async function(charCode) {
          console.log(charCode);
          let instance = await App.contracts.WordEvents.deployed();
        //   instanceCVD = instance;
          console.log("instance: " , instance);
  
          web3.eth.getAccounts(async function(error, accounts) {
              if (error) {
                  console.log(error);
              }
              console.log(accounts);
              var account = accounts[0];
              await instance.voteForWord(charCode, {from: account});
          });
        //   App.winningCharacter = await instance.winningCharacter();
        //   console.log("winningCharacter: " + App.winningCharacter);
    },

    calcRound: function(length) {
        if (!length) {
            return null;
        }
        var votes = 0;
        var round = 1;
        for (votesInRound = 1;;votesInRound++) {
          for (rounds = 1;rounds <= votesInRound;rounds++) {
            votes += votesInRound;
            if (votes > length) {
                return {Round: round, VotesInRound: votesInRound};
            }
            round++;
          }          
        }
      }
  }
  
  
  $(function() {
      $('#voteForm').submit(function () {
          let char = $("#characterInput").val();
          if (char.length != 1) {
              alert("Please enter a character");
          }
          let charCode = char.charCodeAt(0);
          if (charCode < 0 || charCode > 255) {
              alert(char + " is not a valid character");
          }
          App.vote(charCode);
          return false;
      });
  
      App.initWeb3();
  
     
  
  });
  
  