export const casinoAbi =
       [
              {
                     "inputs": [],
                     "stateMutability": "nonpayable",
                     "type": "constructor"
              },
              {
                     "anonymous": false,
                     "inputs": [
                            {
                                   "indexed": false,
                                   "internalType": "uint256",
                                   "name": "_value",
                                   "type": "uint256"
                            }
                     ],
                     "name": "notice",
                     "type": "event"
              },
              {
                     "anonymous": false,
                     "inputs": [
                            {
                                   "indexed": false,
                                   "internalType": "uint256",
                                   "name": "_value",
                                   "type": "uint256"
                            }
                     ],
                     "name": "sender",
                     "type": "event"
              },
              {
                     "inputs": [],
                     "name": "cancelBet",
                     "outputs": [],
                     "stateMutability": "nonpayable",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "casino",
                     "outputs": [
                            {
                                   "internalType": "address",
                                   "name": "",
                                   "type": "address"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "user",
                                   "type": "address"
                            }
                     ],
                     "name": "casinoCommit",
                     "outputs": [],
                     "stateMutability": "nonpayable",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "depositMoney",
                     "outputs": [],
                     "stateMutability": "payable",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "expireTime",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "_user",
                                   "type": "address"
                            }
                     ],
                     "name": "getBetByKey",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "getPhase2Games",
                     "outputs": [
                            {
                                   "internalType": "address[]",
                                   "name": "",
                                   "type": "address[]"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "getPhase4Games",
                     "outputs": [
                            {
                                   "internalType": "address[]",
                                   "name": "",
                                   "type": "address[]"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "initializeGame",
                     "outputs": [],
                     "stateMutability": "payable",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "",
                                   "type": "address"
                            }
                     ],
                     "name": "mapBet",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "",
                                   "type": "address"
                            }
                     ],
                     "name": "mapCasinoHash",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "",
                                   "type": "address"
                            }
                     ],
                     "name": "mapGameCreationTime",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "",
                                   "type": "address"
                            }
                     ],
                     "name": "mapGameResult",
                     "outputs": [
                            {
                                   "internalType": "enum Coinflip.GameResult",
                                   "name": "",
                                   "type": "uint8"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "",
                                   "type": "address"
                            }
                     ],
                     "name": "mapGameResultWinnings",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "",
                                   "type": "address"
                            }
                     ],
                     "name": "mapGamestate",
                     "outputs": [
                            {
                                   "internalType": "enum Coinflip.GameState",
                                   "name": "",
                                   "type": "uint8"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address",
                                   "name": "",
                                   "type": "address"
                            }
                     ],
                     "name": "mapUserChoice",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "maxBet",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "minBet",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "address payable",
                                   "name": "user",
                                   "type": "address"
                            }
                     ],
                     "name": "reveal",
                     "outputs": [],
                     "stateMutability": "nonpayable",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "totalBetAmountsInProgress",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "choice",
                                   "type": "uint256"
                            }
                     ],
                     "name": "userSubmitChoice",
                     "outputs": [],
                     "stateMutability": "nonpayable",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "viewResults",
                     "outputs": [
                            {
                                   "internalType": "enum Coinflip.GameResult",
                                   "name": "",
                                   "type": "uint8"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "viewWinnings",
                     "outputs": [
                            {
                                   "internalType": "uint256",
                                   "name": "",
                                   "type": "uint256"
                            }
                     ],
                     "stateMutability": "view",
                     "type": "function"
              },
              {
                     "inputs": [],
                     "name": "withdrawMoney",
                     "outputs": [],
                     "stateMutability": "nonpayable",
                     "type": "function"
              },
              {
                     "stateMutability": "payable",
                     "type": "receive"
              }
       ]
       