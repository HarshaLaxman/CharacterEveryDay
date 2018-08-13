const cED = artifacts.require("CharacterEveryDay");
const timeTravel = require("./helpers/truffleTimeTravel.js");

const A_Character = 'A'.charCodeAt(0);
const B_Character = 'B'.charCodeAt(0);
const C_Character = 'C'.charCodeAt(0);
const D_Character = 'D'.charCodeAt(0);
const Z_Character = 'Z'.charCodeAt(0);
const Not_Character = "String";


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

		await instance.voteForCharacter(A_Character, {from: accounts[1]});

		let A_Votes = await instance.characterVotes(A_Character);
		assert.equal(A_Votes.valueOf(), 1);
	});

	it("should not allow a non number vote", async () => {
		let err = null
		let instance = await cED.deployed();

		//Overflow Params
		// await instance.voteForCharacter(Not_Character, {from: accounts[2]});
		// let One_Votes = await instance.characterVotes(2);

		// assert.equal(One_Votes.valueOf(), 0);

		try {
			await instance.voteForCharacter(Not_Character, {from: accounts[2]});
		}catch (error) {	
			err = error
		};
		assert.ok(err instanceof Error);
	});	

	it("should allow a vote after a failed vote", async () => {
		let instance = await cED.deployed();

		await instance.voteForCharacter(Z_Character, {from: accounts[2]});

		let Z_Votes = await instance.characterVotes(Z_Character);
		assert.equal(Z_Votes.valueOf(), 1);
	});


	it("should not allow a double vote by the same address", async () => {
		let err = null
		let instance = await cED.deployed();

		try {
			await instance.voteForCharacter(B_Character, {from: accounts[1]});
		}catch (error) {	
			err = error
		};
		assert.ok(err instanceof Error);
	});

	it("should record multiple voters' votes", async () => {
		let instance = await cED.deployed();

		await instance.voteForCharacter(A_Character, {from: accounts[3]});
		await instance.voteForCharacter(B_Character, {from: accounts[4]});
		let characterVotes = await instance.getCharacterVotes.call();

		assert.equal(characterVotes[A_Character].valueOf(), 2);
		assert.equal(characterVotes[B_Character].valueOf(), 1);
	});

	it("should reset vote permissions after a day", async () => {
		let thirtyHours = 108000; //seconds

		await timeTravel.advanceTimeAndBlock(thirtyHours);
		let instance = await cED.deployed();

		await instance.voteForCharacter(C_Character, {from: accounts[1]});
		let day = await instance.day();
		
		assert.equal(day.valueOf(), 1);		
	});

		// it("should not select a character without voting", async () => {
		// 	let err = null;
		// 	let Not_Character = 257;
		// 	// let C_Character = 'C'.charCodeAt(0);
		// 	// let thirtyHours = 108000; //seconds

		// 	// await timeTravel.advanceTimeAndBlock(thirtyHours);
		// 	let instance = await cED.deployed();

		// 	try {
		// 		await instance.voteForCharacter(Not_Character, {from: accounts[1]});
		// 	}catch (error) {
		// 		err = error
		// 	};
		// 	assert.ok(err instanceof Error);

		// 	// let C_Votes = await instance.characterVotes(C_Character);

		// 	// assert.equal(C_Votes, 1);
		// });

	// let err = null
	// 	let instance = await cED.deployed();
	// 	let Not_Character = 257;

	// 	try {
	// 		await instance.voteForCharacter(Not_Character, {from: accounts[1]});
	// 	}catch (error) {	
	// 		err = error
	// 	};
	// 	assert.ok(err instanceof Error);

})