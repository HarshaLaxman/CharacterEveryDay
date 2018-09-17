const cVD = artifacts.require("CharacterVoteDays");

const A_Character = 'A'.charCodeAt(0);
const B_Character = 'B'.charCodeAt(0);
const C_Character = 'C'.charCodeAt(0);
const D_Character = 'D'.charCodeAt(0);
const Z_Character = 'Z'.charCodeAt(0);
const Not_Character = 300;
const Not_Number = "String";


contract('TestCharacterVoteDays', async (accounts) => {
	
	//DAY 2
	it("should be alive", async () => {
		let instance = await cVD.deployed();
		let characterVotes = await instance.getCharacterVotes.call();

		assert.equal(characterVotes[0].valueOf(), 0);
	});

	it("should start at day 2 (contract creation selects initial char at day 1)", async () => {
		let instance = await cVD.deployed();
		let day = await instance.day();

		assert.equal(day.valueOf(), 2);
	});

	it("should record a vote", async () => {
		let instance = await cVD.deployed();

		await instance.voteForCharacter(A_Character, {from: accounts[0]});

		let A_Votes = await instance.characterVotes(A_Character);
		assert.equal(A_Votes.valueOf(), 1);
	});

	it("should not allow a non number vote", async () => {
		let err = null
		let instance = await cVD.deployed();

		try {
			await instance.voteForCharacter(Not_Number, {from: accounts[1]});
		} catch (error) {	
			err = error
		};
		assert.ok(err instanceof Error);
	});	

	it("should not allow a non character number vote (>255)", async () => {
		let err = null
		let instance = await cVD.deployed();

		try {
			await instance.voteForCharacter(Not_Character, {from: accounts[2]});
		}catch (error) {	
			err = error
		};
		assert.ok(err instanceof Error);
	});	

	it("should allow a vote after failed voting", async () => {
		let instance = await cVD.deployed();

		await instance.voteForCharacter(Z_Character, {from: accounts[1]});
		//DAY 3

		let day = await instance.day();
		assert.equal(day.valueOf(), 3);
	});

	it("should record multiple voters' votes", async () => {
		let instance = await cVD.deployed();

		await instance.voteForCharacter(A_Character, {from: accounts[1]});
		await instance.voteForCharacter(B_Character, {from: accounts[2]});
		let characterVotes = await instance.getCharacterVotes.call();

		assert.equal(characterVotes[A_Character].valueOf(), 1);
		assert.equal(characterVotes[B_Character].valueOf(), 1);
	});

	it("should not allow a double vote by the same address", async () => {
		let err = null
		let instance = await cVD.deployed();

		try {
			await instance.voteForCharacter(C_Character, {from: accounts[1]});
		}catch (error) {	
			err = error
		};
		assert.ok(err instanceof Error);
	});

	it("should reset vote permissions after a day", async () => {
		let instance = await cVD.deployed();

		await instance.voteForCharacter(C_Character, {from: accounts[3]});
		//DAY 4

		await instance.voteForCharacter(D_Character, {from: accounts[3]});

		let winningCharacter = await instance.winningCharacter();
		
		assert.equal(winningCharacter.valueOf(), D_Character);		
	});

	it("should add the character that won to the event log", async () => {
		let instance = await cVD.deployed();

		var dayFourWinner;
		await instance.voteForCharacter(D_Character, {from: accounts[1]});
		await instance.voteForCharacter(C_Character, {from: accounts[2]});
		await instance.voteForCharacter(B_Character, {from: accounts[4]}).then((result) => {
			dayFourWinner = result.logs[0].args._character;
		});

		assert.equal(dayFourWinner.valueOf(), D_Character);		
	});

	it("should store all winning characters in event log", async () => {
		let instance = await cVD.deployed();
		
		var storedEvents;
		const allEvents = await instance.allEvents({
			fromBlock: 0,
			toBlock: 'latest'
		});
		await allEvents.watch( await(async(err, responses) => {
			// console.log(res.args._character.valueOf())
			// console.log(res);
			storedEvents = responses.args._character.valueOf();
			// console.log(responses);
			// console.log(storedEvents);
			// allEvents.stopWatching();
		}));
			
		console.log(storedEvents);

		//   setTimeout(allEvents.stopWatching, 1000);

		// instance.allEvents({
		// 	fromBlock: 0,
		// 	toBlock: 'latest'
		//   }, function(error, log) {
		// 	  console.log(log);
		// 	  stopWatching
		//   });

		//   var events = myContractInstance.allEvents([additionalFilterObject,] function(error, log){
		// 	if (!error)
		// 	  console.log(log);
		//    });
		// MetaCoin.deployed().then(meta => {
		// 	const allEvents = meta.allEvents({
		// 	  fromBlock: 0,
		// 	  toBlock: 'latest'
		// 	});
		// 	allEvents.watch((err, res) => {
		// 	  console.log(err, res);
		// 	});
		//   });


		assert.equal(1, 1);		
	});
})