const WEC = artifacts.require("WordEvents");
const fruits = ['Banana', 'Orange', 'Pear', 'Kiwi'];

module.exports = async function(done) {
    
    web3.eth.getAccounts(async (error, accounts) => {
        if (error) {
            console.log(error);
        }

        let instance = await WEC.deployed();

        console.log(accounts.length);

        var fruit;
        for (i = 0;i < 10;i++) {
            for (j = 0;j < 10;j++)  {
                fruit = fruits[Math.floor(Math.random() * fruits.length)];
                // console.log(fruit);
                // console.log(j);
                await instance.voteForWord(fruit, {from: accounts[j]});
            }
        }
    });
       

   


    // let instance = await WEC.deployed();

    // await instance.voteForWord(A_Character, {from: accounts[0]});

    // let A_Votes = await instance.characterVotes(A_Character);
    // assert.equal(A_Votes.valueOf(), 1);


// WEC.deployed().then(function(instance) {
    //     console.log("Setting value to 65...");
    //     return instance.set(65, {
    //         privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
    //     });
    // }).then(function(result) {
    //     console.log("Transaction:", result.tx);
    //     console.log("Finished!");
    //     done();
    // }).catch(function(e) {
    //     console.log(e);
    //     done();
    // });
};