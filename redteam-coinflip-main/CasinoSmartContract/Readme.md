**pragma solidity 0.6.6** - specify the version.

**contract Coinflip** - the name of the contract.

**address public casino** - The address of the casino (The address uses to connect the wallet and account).

**enum GameState {Inactive, CasinoCommit, UserCommit, Reveal}** - GameState disallows user or casino process to next state before the previous state is finished. 
Inactive(users need to initialize the game), CasinoCommit(casino needs to commit its choice), UserCommit(Users need to commit their choices), 
Reveal(Game is waiting to be revealed). ex. the casino cannot commit before the user initializes the game. Users cannot commit before the casino commits. 
The result cannot be revealed before user commit.

**enum GameResult {None,InProgress,Won,Lost}** - GameResult notify the betting result on the front end.
mapping(address => uint256) public mapUserChoice - The hash map between address and uint256 data type. The address will be user address and uint256 will be user's data type
ex. 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4(address) => 0(choice)

**mapping(address => uint256) private mapCasinoSecretChoice** - The mapping between users' addresses and Casino's secret choice. This applies in the revealed phrase. This is a private hash map. It can only be called inside a function.

**mapping(address => uint256) public mapGameCreationTime** - The mapping between user's address and creation time of the game (in uint256 datatype).

**mapping(address => uint256) public mapBet** - The mapping between user's address and the amount of money that the user bet (in uint256 datatype).

**mapping(address => GameState) public mapGamestate** - The mapping between user's address and current user's Gamestate.

**address[] addressKeys** - An array that store the addresses of users.

**mapping(address => uint256) private mapCasinoRandom** - The mapping between user's address and a random number generates with javascrip (in uint256 datatype). This is a private hash map. It can only be called inside a function.

**mapping(address => uint256) public mapCasinoHash** - The mapping between user's address and a hash result (hash_function(random number, secret choice)).

**mapping(address => GameResult) public mapGameResult** - The mapping between user's address and enum GameResult. This Hash map will be used on the front end to display GameResult.

**mapping(address => uint256) public mapGameResultWinnings** - The mapping between user's address and winning amount. This Hash map will use to display the amount of money of the user in the front end.

**uint256 public expireTime = 60** - The amount of time that allows the game to cancel.

**uint256 public minBet = 0.001 ether** - The minimum amount of ether that can be bet by users.

**constructor() public {casino = msg.sender;}** - The constructor calls when the smart contract is deployed. The casino will be initialized to the person who deployed the smart
contract.

**function withdrawMoney() external** - The withdrawMoney function can only call by the casino. When the withdrawMoney function is called, the casino will withdraw all the
free ether(money that has not use to bet against users) from the smart contract. 

**function depositMoney() external payable** - The dopositMoney function can only call by the casino. When the depositMoney function is called, the casino will require to deposit at least 10 ether to the smart contract.

**function viewResults() public view returns (GameResult)** - The viewResults function can only be called when the Gamestate is inactive. when this function is called, it will
return the result of the game. enum GameResult {None,InProgress,Won,Lost}, 0 = None, 1 = InProgress, 2 = Won, 3 = Lost.

**function viewWinnings() public view returns (uint256)** - The viewWinnings function can only be called when the Gamestate is inactive. when this function is called, it will 
return the amount of money that the user(person who calls this function) bets from the previous game times two.

**function maxBet() public view returns (uint256)** - This function will return the amount of free money in the smart contract that can be used to bet against the player. This 
the function provides important information that prevents the player from betting the amount of ether that exceeds the amount of ether in the smart contract.

**function getPhase2Games() public view returns(address[] memory)** - The getPhase2Games can only call by casino. This function will allow bot to call the phase2 
function (casinoCommit) through javascript using web3.js.

**function getPhase4Games() public view returns(address[] memory)** - The getPhase4Games can only call by casino. This function will allow bot to call the phase4
function (reveal) through javascript using web3.js.

**function random() private view returns (uint256)** - The random function will Generate random number through built in function keccak256.

**function initializeGame() external payable** - The initializeGame function cannot call by casino. The Game state for user who calls this funciton must be inactive.
The user cannot bet more than the max amount of the ether. This determines on msg.value <= maxBet() - msg.value. The msg.value will be the amount of money that user bets. The maxBet() function will return current free ether + msg.value. Thus, maxBet() - msg.value = current free ether in smart contract. This function also require the amount of money
bet by user greater than the minimum bet (0.001). When the requirements are met, game state will be set as GameState.CasinoCommit, the bet amount will be stored in mapBet and the game creation time will be stored in mapGameCreationTime. Finally, the user's money will be transfered to smart contract.

**function casinoCommit(address user) external** - This function can only call by casino. This function require user's address as an input. The game state of the user's address must be GameState.CasinoCommit (This means this user already call the initializeGame() function). when all the requirements are met, secretChoice will be create with random() function. secretChoice will only be either 1 or 0. The secretChoice will be stored in mapCasinoSecretChoice. Another random number will be generate with random() and it will be stored in mapCasinoRandom. The hash will be generate with keccak256(abi.encodePacked(secretChoice, mapCasinoRandom[user])). Then the hash number will be stored in mapCasinoHash and it will be used in the real phrase. Finally, the function will change the user's Gamestate to GameState.UserCommit.

**function userSubmitChoice(uint256 choice) external** - This function cannot call by casino. The game state of the user who calls the function must be GameState.UserCommit. The function requires an input with type uint256(unsigned). This function requires the input must be smaller than 2. Notice, since the input is an unsigned number, it cannnot be negative. User's choice will be stored in mapUserChoice and the game state will turn into GameState.Reveal.

**function reveal(address payable user) external** - This function requires game state to be GameState.Reveal. This function requires random number stores in mapCasinoRandom and secret choice stores in mapCasinoSecretChoice to be hash and equal to the hash previously store in mapCasinoHash. This function requires user's address as an input. when user's choice (store in mapUserChoice[user]) equal to casino's choice (store in mapCasinoSecretChoice[user]), smart contract return user's bet amount * 2 ether to the user's wallet. Otherwise, smart contract keep user's betting money. Then the game state will be set as inactive and the betting amount of user will be set into 0.

**function cancelBet() external** - This function cannot call by the casino. This function requires game state to be GameState.CasinoCommit. This function require the amount of game time pass 60 minuts. When the function is called, user get their betting money back from the smart contract. Then, the Gamestate will be set as inactive.

**receive() external payable** - A fallback function requires only money can be sent to the smart contract.

**function getBetByKey(address _user) public view returns (uint256)** - A function that return mapBet[_user].


