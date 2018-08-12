// @ts-ignore
pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CharacterEveryDay.sol";

contract TestCharacterEveryDay {
    // CharacterEveryDay cED = CharacterEveryDay(DeployedAddresses.CharacterEveryDay());
    CharacterEveryDay cED = CharacterEveryDay(DeployedAddresses.CharacterEveryDay());
    // CharacterEveryDay cED = new CharacterEveryDay(42);
    uint zero = 0;
    uint zeroAgain = 0;
    
    function testSanity() public {
        Assert.equal(zero, zeroAgain, "Can't fail");
    }

    function testVoteRecording() public {
        // cED.voteForCharacter(42);
        uint64[256] memory characterVotesBefore = cED.getCharacterVotes();
        uint64 votesBefore = characterVotesBefore[42];
        cED.voteForCharacter(42);
        uint64[256] memory characterVotesAfter = cED.getCharacterVotes();
        uint64 votesAfter = characterVotesAfter[42];

        Assert.equal(uint(votesBefore + 1), uint(votesAfter), "Vote not registered");
    }
}