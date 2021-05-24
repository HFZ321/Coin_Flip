# Phase 2 Bot for Casino & Deposit Ethereum Script

## Overview
<p>We've created a casino bot that is intended to act on behalf of the casino for phase 2. In addition, we wrote a simple script that can be executed anytime so that the casino can deposit 1 or more Ether into the smart contract.</p>

### Config.js setup

There is quite a bit of setup before we can get this bot fully running. We will require the smart contract address,smart contract ABI, private key for the casino wallet, and link for the Web3 provider. We create a `config.js` file that will hold the aforementioned information. Please rename `config-template.js` to `config.js`. 

### Smart Contract ABI

When you are on the Remix IDE, please compile the `casino.sol` file located in `CasinoSmartContract\`. Once compiled, there should be a button to copy the ABI on the left column panel. Click that button and you will temporarily copy the smart contract ABI. Then head over to your `config.js` file and set the variable for `abi` equal to whatever you have just copied. `abi` should be stored as a list, when you copy the abi, it will already be in list form. 

### Smart Contract Address

After compiling your `casino.sol` file, open up your MetaMask browser extension and sign in. Make sure you are on the account for which you to act as the casino. Click on the deploy button and make sure your environment is set to `Injected Web3`. Finally, deploy the contract; you should expect MetaMask to pop up prompting you to approve a minor gas fee. After the contract is deployed, you should see your deployed contract. Copy the address of the deployed contract and store that in your `config.js` file for the variable `smartContractAddress`. `smartContractAddress` should be stored as a string. 

### Casino Wallet Private Key

Since you are deploying the contract using your casino wallet, you want to be able to access certain functions that are only present for the casino. For this to happen, we will also need access to the casino wallet. To get the private key, click on your MetaMask browser extension. Make sure your account is for the casino wallet. Click on the `⋮` symbol, then click on `Account Details`. From there, click on `Export Private Key`. Input your password and retrieve the private key. Assign that value to `casinoPrivateKey`. `casinoPrivateKey` should be stored as a string. 

### Web3 Provider

You'll need a Web3 Provider to access the Ropsten network. Go to [infura.io](https://infura.io) and create an account. After that is done click on `Dashboard` on the top right. On the left panel click on `Ethereum`. Then click on `CREATE NEW PROJECT` on the right side. After writing down a name, you'll see a section called `KEYS`. Make sure sure your `ENDPOINTS` is set to `Ropsten` NOT `Mainnet`. Finally, copy the link below that starts with `https://ropsten.infura.io/... `. Replace your `web3Provider` variable with this information. `web3Provider` should be stored as a string. 

### Initializing your node_modules packagse

Next you have to get the packages pertinent for our bot and deposit script. Make sure you are within the `CasinoBot\` folder. Be sure you have `Node.JS and NPM installed` installed. You can install them [here](https://www.npmjs.com/get-npm) . Write the following commands...

```terminal
npm install
```


### Firing up your bot
If you followed these directions carefully you can now deploy your bot. This is capable of running 24/7 and will scan for games that are in phase 2 every 5 seconds. To run the bot, simply type the following command on the terminal:

```terminal
node phase2Bot.js
```

You should see the following output:
```terminal
web3-shh package will be deprecated in version 1.3.5 and will no longer be supported.
web3-bzz package will be deprecated in version 1.3.5 and will no longer be supported.
web3 is connected
```

Here we chose to print out if we have any active games in a list form that can be visibly seen on the terminal. 

### Depositing Ethereum
This script is executed one time and is adjustable. On Line 28 of `depositEther.js` adjust the amount, but make sure that it is in string form. 

To run the script, simply type the following command on the terminal:
```terminal
node depositEther.js
```

You should expect a response in JSON form that relays information such as `blockHash` and `from`.


Please note that transactions may take 10-30 seconds to process. 
