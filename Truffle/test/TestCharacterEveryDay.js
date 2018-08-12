const cED = artifacts.require("CharacterEveryDay");
const timeTravel = require("./helpers/truffleTimeTravel.js");

contract('TestCharacterEveryDay', async (accounts) => {

	it("should be alive", async () => {
		let instance = await cED.deployed();
		let characterVotes = await instance.getCharacterVotes.call();

		assert.equal(characterVotes[0].valueOf(), 0);
	});

	it("should start at day 0", async () => {
		let instance = await cED.deployed();
		let day = await instance.day();

		assert.equal(day.valueOf(), 0);
	});

	it("should record a vote", async () => {
		let instance = await cED.deployed();
		let A_Character = 'A'.charCodeAt(0);

		await instance.voteForCharacter(A_Character, {from: accounts[1]});

		let A_Votes = await instance.characterVotes(A_Character);
		assert.equal(A_Votes, 1);
	});

	it("should not allow a double vote by the same address", async () => {
		let err = null
		let instance = await cED.deployed();
		let B_Character = 'B'.charCodeAt(0);

		try {
			await instance.voteForCharacter(B_Character, {from: accounts[1]});
		}catch (error) {
			err = error
		};
		assert.ok(err instanceof Error);
	})

	it("should record multiple voters' votes", async () => {
		let instance = await cED.deployed();
		let A_Character = 'A'.charCodeAt(0);
		let B_Character = 'B'.charCodeAt(0);

		await instance.voteForCharacter(A_Character, {from: accounts[2]});
		await instance.voteForCharacter(B_Character, {from: accounts[3]});
		let characterVotes = await instance.getCharacterVotes.call();

		assert.equal(characterVotes[A_Character].valueOf(), 2);
		assert.equal(characterVotes[B_Character].valueOf(), 1);
	});

	it("should reset vote permissions after a day", async () => {
		let C_Character = 'C'.charCodeAt(0);
		let thirtyHours = 108000; //seconds
		await timeTravel.advanceTimeAndBlock(thirtyHours);
		let instance = await cED.deployed();

		await instance.voteForCharacter(C_Character, {from: accounts[1]});
		let day = await instance.day();
		
		assert.equal(day.valueOf(), 1);		
	});

	

})