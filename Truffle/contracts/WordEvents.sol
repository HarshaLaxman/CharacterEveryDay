pragma solidity ^0.4.19;

//Barebones events contract for word votes
//Logic handled on front end => low gas costs
contract WordEvents {
    
    event WordVote(bytes32 _word, address voter);
    
    function voteForWord(bytes32 _word) public {
        emit WordVote(_word, msg.sender); 
    }
}