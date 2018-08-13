pragma solidity ^0.4.19;


contract CharacterEveryDay {
    
    event CharacterSelected(uint8 _character, uint64[256] characterVotes, uint64 day);
    
    uint64[256] public characterVotes;
    
    uint8 public winningCharacter;
    uint64 public day; 
    uint256 public winningCharacterVotes;
    uint256 public timeOfLastVote;
    
    mapping (uint256 => bool) addressVotedToday;
    
    constructor (uint8 _character) public {
        day = 0;
        winningCharacterVotes = 0;
        timeOfLastVote = now;
        voteForCharacter(_character);
    }

    //Does NOT prevent overflow ex: 257 on input becomes 1
    modifier onlyCharacter(uint8 _character) {
        require(_character < 256);
        _;
    }
    
    function voteForCharacter(uint8 _character) public onlyCharacter(_character) {
        if ((now - timeOfLastVote) > 1 days) {
            selectCharacter(winningCharacter);
        }
        
        // require(_character <= 256);
        uint256 todaysAddressHash = uint(keccak256(abi.encodePacked(day, msg.sender)));
        require(addressVotedToday[todaysAddressHash] == false);
        
        characterVotes[_character]++;
        if (characterVotes[_character] > winningCharacterVotes) {
            winningCharacter = _character;
            winningCharacterVotes = characterVotes[_character];
        }
        addressVotedToday[todaysAddressHash] = true;
        timeOfLastVote = now;
    }
    
    function getCharacterVotes() external view returns (uint64[256]) {
        return characterVotes;
    }
    
    function selectCharacter (uint8 _winningCharacter) private {
        day += uint64((now - timeOfLastVote) / 1 days);
        // day += 1;
        emit CharacterSelected(_winningCharacter, characterVotes, day);
        delete characterVotes;
        delete winningCharacter;
        delete winningCharacterVotes;
    }
    
    // function determineWinningCharacter() private {
    //     uint8 winningCharacter = 46; //default if no one voted is '.'
    //     uint256 winningCharacterVotes = 0;
    //     // for (uint8 character = 0; character < characterVotes.length; character++) {
    //     //     if (characterVotes[character] > winningCharacterVotes) {
    //     //         winningCharacterVotes = characterVotes[character];
    //     //         winningCharacter = character;
    //     //     }
    //     // }
    //     addCharacter(winningCharacter);
    // }
    
}