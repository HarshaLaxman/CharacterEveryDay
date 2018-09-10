pragma solidity ^0.4.19;

contract CharacterVoteDays {
    
    event CharacterSelected(uint8 _character, uint64[256] characterVotes, uint64 day);
    
    uint64[256] public characterVotes;
    
    uint8 public winningCharacter;
    uint64 public day; 
    uint64 public winningCharacterVotes;
    uint64 public votesToday;
    
    mapping (uint256 => bool) addressVotedToday;
    
    constructor (uint8 _character) public {
        day = 1;
        winningCharacterVotes = 0;
        votesToday = 0;
        voteForCharacter(_character);
    }

    modifier onlyCharacter(uint256 _character) {
        require(_character < 256, "Not a character");
        _;
    }
    
    function voteForCharacter(uint256 _character) public onlyCharacter(_character) {
        uint256 todaysAddressHash = uint(keccak256(abi.encodePacked(day, msg.sender)));
        require(addressVotedToday[todaysAddressHash] == false, "Sender already voted");

        votesToday += 1;
        characterVotes[_character]++;
        if (characterVotes[_character] > winningCharacterVotes) {
            winningCharacter = uint8(_character);
            winningCharacterVotes = characterVotes[_character];
        }
        if (votesToday == day) {
            selectCharacter(winningCharacter);
            return;
        }  
        addressVotedToday[todaysAddressHash] = true;
    }
    
    function getCharacterVotes() external view returns (uint64[256]) {
        return characterVotes;
    }
    
    function selectCharacter (uint8 _winningCharacter) private {
        day += 1;
        emit CharacterSelected(_winningCharacter, characterVotes, day);
        delete characterVotes;
        delete winningCharacter;
        delete winningCharacterVotes;
        delete votesToday;
    }
}