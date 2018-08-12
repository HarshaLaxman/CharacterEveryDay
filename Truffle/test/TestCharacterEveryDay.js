const cED = artifacts.require("CharacterEveryDay");

contract('TestCharacterEveryDay', async (accounts) => {
	it("should be alive", async () => {
		let instance = await cED.deployed();
		let characterVotes = await instance.getCharacterVotes.call();

		assert.equal(characterVotes[0].valueOf(), 0);
	});

	it("should record a vote", async () => {
		let instance = await cED.deployed();
		let H_Character = 'H'.charCodeAt(0);

		await instance.voteForCharacter(H_Character, {from: accounts[0]});
		let characterVotes = await instance.getCharacterVotes.call();

		assert.equal(characterVotes[H_Character].valueOf(), 1);
	});

	it("should not allow a double vote by the same address", async () => {
		let err = null
		let instance = await cED.deployed();
		let L_Character = 'L'.charCodeAt(0);

		try {
			await instance.voteForCharacter(L_Character, {from: accounts[0]});
		}catch (error) {
			err = error
		};
		assert.ok(err instanceof Error);
	})

	it("should record multiple voters' votes", async () => {
		let instance = await cED.deployed();
		let H_Character = 'H'.charCodeAt(0);
		let L_Character = 'L'.charCodeAt(0);

		await instance.voteForCharacter(H_Character, {from: accounts[1]});
		await instance.voteForCharacter(L_Character, {from: accounts[2]});
		let characterVotes = await instance.getCharacterVotes.call();

		assert.equal(characterVotes[H_Character].valueOf(), 2);
		assert.equal(characterVotes[L_Character].valueOf(), 1);
	});

})