pragma solidity 0.6.6;

contract Coinflip {
    address public casino;
    enum GameState {Inactive, CasinoCommit, UserCommit, Reveal}

    enum GameResult {None,InProgress,Won,Lost}

    mapping(address => uint256) public mapUserChoice;
    mapping(address => uint256) private mapCasinoSecretChoice;
    mapping(address => uint256) public mapGameCreationTime;
    mapping(address => uint256) public mapBet;
    mapping(address => GameState) public mapGamestate;
    address[] addressKeys;
    mapping(address => uint256) private mapCasinoRandom;
    mapping(address => uint256) public mapCasinoHash;


    mapping(address => GameResult) public mapGameResult;
    mapping(address => uint256) public mapGameResultWinnings;

    uint256 public expireTime = 60;
    uint256 public minBet = 0.001 ether;

    constructor() public {
        casino = msg.sender;

    }

    function withdrawMoney() external {
        require(
            msg.sender == casino,
            "Only the casino may withdraw money into the smart contract"
        );
        payable(msg.sender).transfer(maxBet());
    }

    //Casino deposit 10 ETH to Smart Contract
    function depositMoney() external payable {
        //Requirements
        // 1. Stop the user from starting a new game when their game is already in progress
        // 2/3 Prevent user from providing insufficient/excessive bet amount
        require(
            msg.sender == casino,
            "Only the casino may deposit money into the smart contract"
        );
        require(
            msg.value >= 1 ether
        );

        //User gives contract the ETH for bet
        payable(address(this)).transfer(msg.value);
    }

    //FOR FRONT-END - User can see how much they won/lost after reveal phase
    function viewResults() public view returns (GameResult){
        require(
            mapGamestate[msg.sender] == GameState.Inactive,
            "You already have an active game. Please wait until that game is finished first"
        );

        return mapGameResult[msg.sender];
    }

     function viewWinnings() public view returns (uint256){
        require(
            mapGamestate[msg.sender] == GameState.Inactive,
            "You already have an active game. Please wait until that game is finished first"
        );

        return mapGameResultWinnings[msg.sender];
    }

    //Dynamically generates the maximum possible bet a user can make with respect to smart contract wallet + bets
    function maxBet() public view returns (uint256) {
        uint256 currentBalance = address(this).balance;

        uint256 boundMoney = 0;

        for (uint i=0; i < addressKeys.length; i++){
            boundMoney += getBetByKey(addressKeys[i]);
        }

        return currentBalance - 2*boundMoney;
    }

    function getPhase2Games() public view returns(address[] memory) {
        require(msg.sender == casino,"You are not permitted to access this function");
        
        
        address[] memory phase2 = new address[](addressKeys.length);
        
        for (uint i=0; i<addressKeys.length; i++){
            if (mapGamestate[addressKeys[i]] == GameState.CasinoCommit){
                phase2[i] = addressKeys[i];
            }
        }
        
        return phase2;
    }

    function getPhase4Games() public view returns(address[] memory) {
        require(msg.sender == casino,"You are not permitted to access this function");
        
        
        address[] memory phase4 = new address[](addressKeys.length);
        
        for (uint i=0; i<addressKeys.length; i++){
            if (mapGamestate[addressKeys[i]] == GameState.Reveal){
                phase4[i] = addressKeys[i];
            }
        }
        
        return phase4;
    }

    //Generates random number to determine heads/tail
    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, now, msg.sender))
            );
    }

    //PHASE ONE: USER INITIALIZES NEW GAME
    function initializeGame() external payable {
        //Requirements
        // 1. Stop the user from starting a new game when their game is already in progress
        // 2/3 Prevent user from providing insufficient/excessive bet amount
        require(
            msg.sender != casino,
            "Casinos cannot play a game with themselves"
        );
        require(
            mapGamestate[msg.sender] == GameState.Inactive,
            "You already have an active game. Please wait until that game is finished first"
        );
        require(
            msg.value <= maxBet() - msg.value,
            "You've exceeded the maximum possible bet of 2 ether"
        );
        require(msg.value >= minBet, "You must provide a minimum of 0.001 ether");

        bool found = false;
        for (uint i=0; i < addressKeys.length; i++){
            if (addressKeys[i] == msg.sender){
                found = true;
                break;
            }
        }
        if (!found){
            addressKeys.push(msg.sender);
        } 

        //Prep Gamestate for phase 2
        mapGamestate[msg.sender] = GameState.CasinoCommit;

        //Keep a record of how much has been betted for this round, so that casino can offer the same amount
        mapBet[msg.sender] = msg.value;

        //Keep a record of creation time so we can account for expiration of a game
        mapGameCreationTime[msg.sender] = block.timestamp;

        //Keep track of the game mapGameResultWinnings
        mapGameResult[msg.sender] = GameResult.InProgress;

        //User gives contract the ETH for bet
        payable(address(this)).transfer(mapBet[msg.sender]);
    }

    //PHASE TWO: CASINO COMMITS HEADS/TAILS

    function casinoCommit(address user) external {
        //Requirements
        // 1. Stop any address, other than casino from accessing this function.
        // 2. Prevent casino from committing heads/tails after user passes their choice. This prevents cheating and ensures we follow Phase 1 --> 2 --> 3 --> 4
        require(
            msg.sender == casino,
            "Only the casino may access this function."
        );
        require(
            mapGamestate[user] == GameState.CasinoCommit,
            "The casino is not authorized to commit to heads or tails for this session at this time."
        );

        //Generate random 0/1 for the casino
        uint256 secretChoice = random() % 2;

        //Store the casino's secret choice into a map
        mapCasinoSecretChoice[user] = secretChoice;

        //Store the casino's randomly generated uint into a map
        mapCasinoRandom[user] = random();

        //Hash the secretChoice and the randomly generated uint that can be used to verify the casino commitment during the revealing phase.
        mapCasinoHash[user] = uint256(
            keccak256(abi.encodePacked(secretChoice, mapCasinoRandom[user]))
        );
        //Prep Gamestate for phase 3
        mapGamestate[user] = GameState.UserCommit;
    }

    //PHASE THREE: USER SENDS THEIR choice
    function userSubmitChoice(uint256 choice) external {
        //Requirements
        //1. Prevent casino from accessing this function
        //2. Prevent the user from submitting a choice when the game is not at phase int32
        //3. Make sure their choice is valid
        //How can we make sure that this is the user that initilize the game?
        require(msg.sender != casino, "This function is intended for users only, not casinos.");
        require(
            mapGamestate[msg.sender] == GameState.UserCommit,
            "You are not permitted to issue heads/tails at this time."
        );
        require(choice < 2, "Please send a 0 or 1");

        //Store the user's choice (unhashed) into a map
        mapUserChoice[msg.sender] = choice;

        //Prep Gamestate for phase 4
        mapGamestate[msg.sender] = GameState.Reveal;
    }

    //PHASE FOUR: REVEAL CHOICES
    // **NOTE** Any party can reveal this so as long as they have the casino's original choice and random number which can be cross-checked with our stored hash

    function reveal(address payable user) external {
        //Requirements
        // 1. Make sure that the address provided consists of a user whose game is already in Phase 4
        // 2. Make sure that the choice and randomNumber when hashed is the same hash that we have stored in mapCasinoSecretChoice

        require(
            mapGamestate[user] == GameState.Reveal,
            "This user's game is not ready for the reveal phase"
        );
        require(
            uint256(
                keccak256(
                    abi.encodePacked(
                        mapCasinoSecretChoice[user],
                        mapCasinoRandom[user]
                    )
                )
            ) == mapCasinoHash[user],
            "CHEATING DETECTED: We cannot proceed with the reveal"
        );

        if (mapUserChoice[user] == mapCasinoSecretChoice[user]) {
            // User wins the game
            payable(user).transfer(mapBet[user] * 2);

            mapGameResult[user] = GameResult.Won;
        }else{
            mapGameResult[user] = GameResult.Lost;
        }

        mapGameResultWinnings[user] = mapBet[user]*2;

        //Reset the game and prep for Phase 1
        mapGamestate[user] = GameState.Inactive;
        mapBet[user] = 0;

    }

    function cancelBet() external {
        require(msg.sender != casino, "This function is intended for users only, not casinos.");
        require(
            mapGamestate[msg.sender] == GameState.CasinoCommit,
            "This user doesn't have an active bet"
        );
        //player can only cancel the bet if the casino doesn't respond within the expire time.
        require(block.timestamp > mapGameCreationTime[msg.sender] + expireTime);

        (msg.sender).transfer(mapBet[msg.sender]);

        mapGamestate[msg.sender] = GameState.Inactive;
        mapBet[msg.sender] = 0;
    }

    receive() external payable {
        require(msg.data.length == 0);
    }



    function getBetByKey(address _user) public view returns (uint256) {
        return mapBet[_user];
    }

}
